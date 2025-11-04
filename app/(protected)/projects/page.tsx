import React from 'react';
import { loadProjects } from '@/app/(protected)/loaders';
import ProjectsClient from './ClientPage';

export const revalidate = 60; // short window; mutations should revalidate tags

export default async function ProjectsPage() {
  let initialProjects: any[] = [];
  try {
    initialProjects = await loadProjects();
  } catch {
    initialProjects = [];
  }
  return <ProjectsClient initialProjects={initialProjects} />;
}
