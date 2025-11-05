import 'server-only';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn('NEXT_PUBLIC_API_URL is not set; server fetchers will fail.');
}

export const TAGS = {
  // Public data
  PUBLIC_RESULT: 'public-result',
  PUBLIC_COMPETITOR: 'public-competitor',

  // User data
  USER: (userId: string) => `user:${userId}`,
  USER_CREDITS: (userId: string) => `user-credits:${userId}`,
  USER_BILLING: (userId: string) => `user-billing:${userId}`,
  USER_SETTINGS: (userId: string) => `user-settings:${userId}`,

  // Projects
  PROJECTS: 'projects',
  PROJECT: (id: string) => `project:${id}`,
  PROJECT_RESULTS: (projectId: string) => `project-results:${projectId}`,

  // Agents
  AGENTS: 'agents',
  AGENT: (id: string) => `agent:${id}`,
  AGENT_RUN: (runId: string) => `agent-run:${runId}`,

  // Plans & Billing
  CREDITS: 'credits',
  PLANS: 'plans',

  // Startup specific
  STARTUP: (id: string) => `startup:${id}`,
  STARTUP_DETAILS: (id: string) => `startup-details:${id}`,
} as const;

export const DEFAULT_REVALIDATE = {
  // Static/semi-static data (longer cache)
  plans: 60 * 30, // 30 minutes
  agents: 60 * 10, // 10 minutes
  publicResult: 60 * 5, // 5 minutes
  competitorList: 60 * 5, // 5 minutes

  // User-specific data (shorter cache)
  projects: 60, // 1 minute
  credits: 60 * 2, // 2 minutes
  userSettings: 60 * 5, // 5 minutes
  billing: 60 * 10, // 10 minutes

  // Real-time data (very short cache)
  startupDetails: 30, // 30 seconds
  agentRun: 30, // 30 seconds
} as const;

export type FetchOptions = {
  revalidate?: number | false;
  tags?: string[];
  init?: RequestInit;
};

export async function serverFetchJSON<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  if (!API_URL) throw new Error('Missing NEXT_PUBLIC_API_URL');
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const { revalidate, tags, init } = opts;

  const fetchInit: any = {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    next: {
      ...(typeof revalidate !== 'undefined' ? { revalidate } : {}),
      ...(tags && tags.length ? { tags } : {}),
    },
  };

  const res = await fetch(url, fetchInit);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

// Domain helpers (examples)
export const fetchPlans = () =>
  serverFetchJSON<{ plans: any[] }>(`/plans`, {
    revalidate: DEFAULT_REVALIDATE.plans,
    tags: [TAGS.PLANS],
  });

export const fetchAgents = (token?: string) =>
  serverFetchJSON<{ agents: any[] }>(`/agents`, {
    revalidate: DEFAULT_REVALIDATE.agents,
    tags: [TAGS.AGENTS],
    init: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });

export const fetchProjects = (token?: string) =>
  serverFetchJSON<{ projects: any[] }>(`/projects`, {
    revalidate: DEFAULT_REVALIDATE.projects,
    tags: [TAGS.PROJECTS],
    init: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
