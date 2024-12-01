'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTopCategories } from '@/lib/twitch/categories';
import type { Category, CategoryType } from '@/types/category';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Gamepad2, Users, Music2, Palette, Trophy } from 'lucide-react';

interface CategorySelectorProps {
  onSelect: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
}

const CATEGORY_GROUPS: { type: CategoryType; label: string; icon: React.ReactNode }[] = [
  { type: 'games', label: 'Games', icon: <Gamepad2 className="h-4 w-4" /> },
  { type: 'irl', label: 'IRL', icon: <Users className="h-4 w-4" /> },
  { type: 'music', label: 'Music', icon: <Music2 className="h-4 w-4" /> },
  { type: 'creative', label: 'Creative', icon: <Palette className="h-4 w-4" /> },
  { type: 'sports', label: 'Sports', icon: <Trophy className="h-4 w-4" /> },
];

export function CategorySelector({ 
  onSelect, 
  selectedCategoryId, 
  activeTab,
  onTabChange 
}: CategorySelectorProps) {
  const [categoriesByType, setCategoriesByType] = useState<Record<CategoryType, Category[]>>({
    games: [],
    irl: [],
    music: [],
    creative: [],
    sports: [],
  });
  const [loading, setLoading] = useState(true);

  // Load categories for a specific type
  const loadCategories = useCallback(async (type: CategoryType) => {
    try {
      if (categoriesByType[type].length > 0) return;
      
      const topCategories = await getTopCategories(type, 12);
      setCategoriesByType(prev => ({
        ...prev,
        [type]: topCategories
      }));
    } catch (error) {
      console.error(`Failed to load ${type} categories:`, error);
    }
  }, [categoriesByType]);

  // Load initial categories
  useEffect(() => {
    const loadInitialCategories = async () => {
      setLoading(true);
      try {
        await Promise.all(CATEGORY_GROUPS.map(group => loadCategories(group.type)));
      } finally {
        setLoading(false);
      }
    };

    loadInitialCategories();
  }, [loadCategories]);

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    // Validate that the value is a valid CategoryType before calling onTabChange
    if (value === 'games' || value === 'irl' || value === 'music' || value === 'creative' || value === 'sports') {
      onTabChange(value);
      loadCategories(value);
    }
  }, [loadCategories, onTabChange]);

  // Handle category selection
  const handleCategorySelect = useCallback((category: Category) => {
    const newSelectedId = selectedCategoryId === category.id ? null : category.id;
    onSelect(newSelectedId);
  }, [selectedCategoryId, onSelect]);

  const renderCategories = useCallback((categories: Category[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className={`relative aspect-[3/4] cursor-pointer transition-all hover:scale-105 ${
            selectedCategoryId === category.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleCategorySelect(category)}
        >
          <Image
            src={category.boxArtUrl}
            alt={category.name}
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold truncate text-sm">{category.name}</h3>
          </div>
        </Card>
      ))}
    </div>
  ), [selectedCategoryId, handleCategorySelect]);

  const renderSkeletons = useCallback(() => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
      ))}
    </div>
  ), []);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-4">
        {CATEGORY_GROUPS.map(group => (
          <TabsTrigger key={group.type} value={group.type} className="gap-2">
            {group.icon}
            {group.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {CATEGORY_GROUPS.map(group => (
        <TabsContent key={group.type} value={group.type} className="mt-0">
          {loading && !categoriesByType[group.type].length 
            ? renderSkeletons() 
            : renderCategories(categoriesByType[group.type])
          }
        </TabsContent>
      ))}
    </Tabs>
  );
}
