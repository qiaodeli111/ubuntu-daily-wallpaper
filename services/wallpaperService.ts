
import { Wallpaper } from '../types';

export const fetchWallpapers = async (): Promise<Wallpaper[]> => {
  // Mocking Bing and Unsplash data for demonstration
  // In a real app, you would fetch from Bing HPImageArchive or Unsplash API
  const today = new Date().toISOString().split('T')[0];
  
  const mockWallpapers: Wallpaper[] = [
    {
      id: 'bing-1',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=400',
      title: 'Alpine Meadow at Dawn',
      description: 'The morning mist clears over a lush mountain valley.',
      copyright: '© Nature Photography',
      source: 'Bing',
      date: today
    },
    {
      id: 'unsplash-1',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
      title: 'Stellar Peaks',
      description: 'Granite peaks reaching for the stars in a clear night sky.',
      source: 'Unsplash',
      date: today
    },
    {
      id: 'unsplash-2',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400',
      title: 'Sunlight Through Redwoods',
      description: 'Ethereal light filtering through the canopy of a giant forest.',
      source: 'Unsplash',
      date: today
    },
    {
      id: 'unsplash-3',
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400',
      title: 'Serene Lake Reflection',
      description: 'Perfect mirror reflections on a glacial mountain lake.',
      source: 'Unsplash',
      date: today
    },
    {
      id: 'unsplash-4',
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=400',
      title: 'Rolling Hills',
      description: 'The green slopes of Tuscany under a golden sun.',
      source: 'Unsplash',
      date: today
    },
    {
      id: 'unsplash-5',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400',
      title: 'Yosemite Valley',
      description: 'Iconic view of the El Capitan monolith.',
      source: 'Unsplash',
      date: today
    }
  ];

  return mockWallpapers;
};
