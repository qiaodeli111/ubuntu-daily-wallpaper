
export interface Wallpaper {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  copyright?: string;
  source: 'Bing' | 'Unsplash' | 'AI' | 'Local';
  date: string;
}

export enum Category {
  DAILY = 'daily',
  LANDSCAPE = 'landscape',
  MINIMAL = 'minimal',
  AI_GEN = 'ai_gen'
}
