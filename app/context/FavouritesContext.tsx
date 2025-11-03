// FavoritesContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost, } from '../utils/interceptor';

type LitterResponse = {
  id: number;
};

type BreederResponse = {
  id: number;
};

type FavouritesResponse = {
  litters: LitterResponse[];
  breeders: BreederResponse[];
};

const FavoritesContext = createContext({
  favorites: new Set<number>(),
  loading: true,
  toggleFavorite: async (itemId: number, type: 'litter' | 'breeder') => { },
  isFavorited: (itemId: number) => false as boolean,
  refetchFavorites: () => { }
});

export const FavoritesProvider = ({ children, userId }: { children: React.ReactNode; userId: number }) => {
  const [favorites, setFavorites] = useState(new Set<number>());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      const data: FavouritesResponse = await apiGet<FavouritesResponse>(`favorites?user_id=${userId}`);
      const favoriteIds = new Set<number>(
        (data.litters || []).concat(data.breeders || []).map(item => item.id)
      );
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (itemId: number, type: 'litter' | 'breeder') => {
    const newFavorites = new Set(favorites);
    const isCurrentlyFavorited = newFavorites.has(itemId);

    try {
      if (isCurrentlyFavorited) {
        newFavorites.delete(itemId);
        await apiDelete('favorites', { user_id: userId, [`${type}_id`]: itemId });
      } else {
        newFavorites.add(itemId);
        await apiPost('favorites/', { user_id: userId, [`${type}_id`]: itemId });
      }
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      if (isCurrentlyFavorited) {
        newFavorites.add(itemId);
      } else {
        newFavorites.delete(itemId);
      }
      setFavorites(newFavorites);
    }
  };

  const isFavorited = (itemId: number) => favorites.has(itemId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        toggleFavorite,
        isFavorited,
        refetchFavorites: fetchFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};