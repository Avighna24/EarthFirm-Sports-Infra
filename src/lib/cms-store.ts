import { CMSData } from '../types';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'earthfirm_cms_data';

const DEFAULT_CMS_DATA: CMSData = {
  testimonials: [
    {
      id: '1',
      name: 'Rohan Sharma',
      role: 'Facilities Manager, Apex Sports Academy',
      content: 'Earthfirm delivered our multi-sport arena 2 weeks ahead of schedule. The quality of the Canadian Maple flooring is world-class.',
      stars: 5,
      date: '2024-03-15'
    },
    {
      id: '2',
      name: 'Anita Desai',
      role: 'Director, Heritage International School',
      content: 'Their consultative approach to the swimming pool design was refreshing. They understood our safety requirements perfectly.',
      stars: 5,
      date: '2024-05-20'
    }
  ],
  partners: [
    { id: '1', name: 'SportCourt Global', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?auto=format&fit=crop&q=80&w=200' },
    { id: '2', name: 'MapleTech surfaces', logo: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=200' },
    { id: '3', name: 'Arena Lighting solutions', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200' }
  ],
  portfolio: [
    {
      id: 'p1',
      title: 'The National Basketball Center',
      location: 'New Delhi',
      category: 'BASKETBALL',
      image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800',
      description: 'A 4-court professional facility using FIBA Grade 1 Maple flooring.',
      year: '2023'
    },
    {
      id: 'p2',
      title: 'Leela Sky Residency Pool',
      location: 'Mumbai',
      category: 'SWIMMING_POOL',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800',
      description: 'Olympic-sized infinity pool with automated filtration systems.',
      year: '2022'
    }
  ],
  team: [
    {
      id: 't1',
      name: 'Prakash Sharma',
      role: 'Technical Director',
      description: 'Overseeing structural foundation concrete, precision asphalt leveling, and international safety grading compliance.',
      type: 'FOUNDER'
    },
    {
      id: 't2',
      name: 'Aditya Bhadoria',
      role: 'Managing Director',
      description: 'Leading strategic expansion, client consultation workflows, and partnerships with national academies and schools.',
      type: 'FOUNDER'
    }
  ]
};

export const getInitialCMSData = (): CMSData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_CMS_DATA;
  try {
    const parsed = JSON.parse(stored);
    // Migration: ensure new fields exist
    if (!parsed.team) parsed.team = DEFAULT_CMS_DATA.team;
    return parsed;
  } catch (e) {
    return DEFAULT_CMS_DATA;
  }
};

export const getCMSData = (): CMSData => {
  return getInitialCMSData();
};

export const saveCMSData = async (data: CMSData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('earthfirm_cms_updated'));

  try {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result && result.success) {
      console.log('[CMS STORE] CMS data synchronized successfully with server.');
    } else {
      console.warn('[CMS STORE] Server failed to persist CMS data:', result.error);
    }
  } catch (err) {
    console.error('[CMS STORE] Failed to sync CMS data with server API:', err);
  }
};

export const useCMSData = () => {
  const [data, setData] = useState<CMSData>(getInitialCMSData());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(getInitialCMSData());

    // Fetch from global backend storage asynchronously
    setLoading(true);
    fetch('/api/cms')
      .then(res => res.json())
      .then(serverData => {
        if (serverData && typeof serverData === 'object' && !serverData.error) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
          setData(serverData);
        }
      })
      .catch(err => {
        console.warn('[CMS STORE] Failed to load server-side CMS data, utilizing local offline cache:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setData(getInitialCMSData());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const handleLocalCmsUpdate = () => {
      setData(getInitialCMSData());
    };
    window.addEventListener('earthfirm_cms_updated', handleLocalCmsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('earthfirm_cms_updated', handleLocalCmsUpdate);
    };
  }, []);

  return { data, loading };
};
