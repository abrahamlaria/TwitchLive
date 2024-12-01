export interface Category {
    id: string;
    name: string;
    boxArtUrl: string;
    viewerCount?: number;
  }
  
  export type CategoryType = 'games' | 'irl' | 'music' | 'creative' | 'sports';
  
  export interface CategoryGroup {
    type: CategoryType;
    label: string;
    categories: Category[];
  }