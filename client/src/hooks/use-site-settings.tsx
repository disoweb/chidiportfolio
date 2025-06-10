import { useQuery } from '@tanstack/react-query';

export function useSiteSettings() {
  const { data: settings, isLoading: loading } = useQuery({
    queryKey: ['/api/admin/settings'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        return response.json();
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
        // Return default settings on error
        return {
          seoTitle: 'Chidi Ogara - Senior Fullstack Developer',
          seoDescription: 'Professional fullstack web developer specializing in React, Node.js, and modern web technologies.',
          seoKeywords: 'fullstack developer, web development, React, Node.js, TypeScript',
          ogImage: '',
          siteName: 'Chidi Ogara Portfolio',
          contactEmail: 'chidi@example.com',
          socialLinks: {
            linkedin: '',
            github: '',
            twitter: ''
          }
        };
      }
    },
    staleTime: 1000, // 1 second to allow for quicker updates
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return { settings, loading };
}