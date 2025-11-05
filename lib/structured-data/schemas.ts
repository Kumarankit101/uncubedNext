/**
 * Structured Data Schemas (JSON-LD)
 *
 * Provides schema.org markup for better SEO and rich snippets in search results.
 */

import { Organization, Product, WebSite, FAQPage, BreadcrumbList, WithContext } from 'schema-dts';

/**
 * Organization schema for the company
 */
export function getOrganizationSchema(): WithContext<Organization> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uncubed.me';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Uncubed',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'AI-powered startup co-pilot that helps transform your ideas into reality with market research and strategic guidance.',
    foundingDate: '2024',
    sameAs: [
      // Add social media links when available
      // 'https://twitter.com/uncubed',
      // 'https://linkedin.com/company/uncubed',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@uncubed.me',
      contactType: 'Customer Support',
    },
  };
}

/**
 * Website schema with search functionality
 */
export function getWebSiteSchema(): WithContext<WebSite> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uncubed.me';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Uncubed',
    url: baseUrl,
    description: 'AI-powered startup co-pilot for idea validation and market research',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    } as any,
  };
}

/**
 * Product schema for pricing plans
 */
export function getPricingSchema(plan: {
  name: string;
  price: number;
  currency: string;
  features: string[];
}): WithContext<Product> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uncubed.me';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Uncubed ${plan.name} Plan`,
    description: `AI-powered startup co-pilot with ${plan.features.join(', ')}`,
    brand: {
      '@type': 'Brand',
      name: 'Uncubed',
    },
    offers: {
      '@type': 'Offer',
      price: plan.price.toString(),
      priceCurrency: plan.currency,
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/billing`,
      seller: {
        '@type': 'Organization',
        name: 'Uncubed',
      },
    },
  };
}

/**
 * FAQ schema for help/FAQ pages
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Breadcrumb schema for navigation
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Helper to render JSON-LD script tag
 */
export function renderJsonLd(data: WithContext<any>) {
  return {
    __html: JSON.stringify(data),
  };
}
