import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uncubed.me'
  const currentDate = new Date()

  // Static pages with improved configuration
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // TODO: Add dynamic routes when available
  // Example: Fetch public shared results from API
  // const publicResults = await fetchPublicResults();
  // const resultPages = publicResults.map(result => ({
  //   url: `${baseUrl}/shared/result/${result.type}/${result.id}`,
  //   lastModified: new Date(result.updatedAt),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }));

  return [...staticPages]
}