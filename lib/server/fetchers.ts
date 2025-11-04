import 'server-only';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn('NEXT_PUBLIC_API_URL is not set; server fetchers will fail.');
}

export const TAGS = {
  PUBLIC_RESULT: 'public-result',
  PUBLIC_COMPETITOR: 'public-competitor',
  PROJECTS: 'projects',
  PROJECT: (id: string) => `project:${id}`,
  AGENTS: 'agents',
  CREDITS: 'credits',
  PLANS: 'plans',
} as const;

export const DEFAULT_REVALIDATE = {
  plans: 60 * 30, // 30m
  agents: 60 * 10, // 10m
  publicResult: 60 * 5, // 5m
  competitorList: 60 * 5, // 5m
  projects: 60, // 1m
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
