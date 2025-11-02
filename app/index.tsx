import React from 'react';
import App from './app';
import AuthProvider, { useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavouritesContext';
import useFigtreeFonts from './utils/fontLoader';

function HomeContent() {
  const { user } = useAuth();
  const { fontsLoaded } = useFigtreeFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <FavoritesProvider userId={user?.id || 0}>
      <App />
    </FavoritesProvider>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}

