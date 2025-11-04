import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { fetchPlans, fetchAgents, fetchProjects, serverFetchJSON, TAGS, DEFAULT_REVALIDATE } from '@/lib/server/fetchers';

export async function loadPlans() {
  const { plans } = await fetchPlans();
  return plans;
}

export async function loadAgents() {
  const { getToken } = await auth();
  const token = await getToken();
  const data = await serverFetchJSON<{ agents: any[] }>(`/agents`, {
    revalidate: DEFAULT_REVALIDATE.agents,
    tags: [TAGS.AGENTS],
    init: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
  return data.agents;
}

export async function loadProjects() {
  const { getToken } = await auth();
  const token = await getToken();
  const data = await serverFetchJSON<{ projects: any[] }>(`/projects`, {
    revalidate: DEFAULT_REVALIDATE.projects,
    tags: [TAGS.PROJECTS],
    init: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
  return data.projects;
}

export async function loadCredits() {
  const { getToken } = await auth();
  const token = await getToken();
  const data = await serverFetchJSON<{ credits: { balance: number } }>(`/credits`, {
    revalidate: 60,
    tags: [TAGS.CREDITS],
    init: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
  return data.credits.balance;
}
