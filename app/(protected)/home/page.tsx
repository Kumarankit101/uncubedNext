import { auth } from '@clerk/nextjs/server';
import { fetchAgents, fetchProjects } from '@/lib/server/fetchers';
import DashboardClient from './DashboardClient';

export default async function HomePage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [agentsRes, projectsRes] = await Promise.all([
    fetchAgents(token || undefined),
    fetchProjects(token || undefined),
  ]);

  return (
    <DashboardClient
      initialAgents={agentsRes.agents}
      initialProjects={projectsRes.projects}
    />
  );
}