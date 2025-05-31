
import { useState, useEffect } from 'react';

interface SiteSettings {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
  siteName: string;
  contactEmail: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
  };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
