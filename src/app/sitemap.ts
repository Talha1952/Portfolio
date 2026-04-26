import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Use the actual domain once registered, defaulting to Vercel string for now.
    const baseUrl = 'https://talha-portfolio.vercel.app';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ];
}
