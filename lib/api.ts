// Refactored: Pure API methods, no Clerk dependency
const APIBASEURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface SharedResultData {
  content?: string;
  title: string;
  agentName: string;
  status: string;
  competitors?: any[];
}

// Helper to base64 encode strings with Unicode support
function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

export class ApiClient {
  baseURL: string;
  private ongoingRequests: Map<string, Promise<any>> = new Map();

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Token is passed during API call
  async request<T>(endpoint: string, options: RequestInit = {}, token?: string | null): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';

    // Create request key: include body hash for non-idempotent methods to avoid deduplicating different POST/PUT requests
    const isIdempotent = ['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
    const bodyHash = !isIdempotent && options.body ? toBase64(JSON.stringify(options.body)) : '';
    const requestKey = `${method}:${url}:${bodyHash}`;

    // Check for ongoing request (prevent race by checking again after setting)
    let existingPromise = this.ongoingRequests.get(requestKey);
    if (existingPromise) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Deduplicating request: ${requestKey}`);
      }
      return existingPromise;
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const requestPromise = (async (): Promise<T> => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Making API request: ${method} ${endpoint}`);
        }
        const response = await fetch(url, config);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`API request failed: ${endpoint}`, error);
        throw error;
      } finally {
        this.ongoingRequests.delete(requestKey);
      }
    })();

    // Set the promise in map (race-safe: if another set it meanwhile, we return the existing one)
    existingPromise = this.ongoingRequests.get(requestKey);
    if (existingPromise) {
      return existingPromise;
    }
    this.ongoingRequests.set(requestKey, requestPromise);

    // Auto-cleanup after timeout to prevent memory leaks
    setTimeout(() => {
      this.ongoingRequests.delete(requestKey);
    }, 30000); // 30s timeout

    return requestPromise;
  }
  async getPlans() {
    return this.request('/plans');
  }

  // Public API method for fetching shared results without authentication
  async getPublicResult(resultId: string): Promise<SharedResultData> {
    return this.request(`/outputs/public/${resultId}`, {}, null);
  }

  // Public API method for fetching shared competitor results
  async getPublicCompetitors(resultId: string): Promise<SharedResultData> {
    return this.request(`/competitors/public/${resultId}`, {}, null);
  }
}

export const apiClient = new ApiClient(APIBASEURL);
