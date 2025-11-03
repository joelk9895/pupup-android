import HeartIcon from '@/app/icons/heartIcon';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useFavorites } from '../../context/FavouritesContext';

type LitterResponse = { id: number;[k: string]: any };
type BreederResponse = { id: number;[k: string]: any };

type AuthManagerType = { isLoggedIn: boolean };
type NavigationManagerType = { loginPromptContext: (ctx: 'signInToContinue') => void };

interface Props {
  id: number;
  litter?: LitterResponse | null;
  breeder?: BreederResponse | null;
  authManager?: AuthManagerType;
  navigationManager?: NavigationManagerType;
  variant?: 'default' | 'tab';
}


export default function FavouriteButton(props: Props) {
  const {
    id,
    litter,
    breeder,
    authManager,
    navigationManager,
    variant = 'default',
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const { isFavorited, toggleFavorite } = useFavorites();

  const itemId = litter?.id || breeder?.id || 0;
  const type = litter ? 'litter' : 'breeder';
  const isFavourite = isFavorited(itemId);

  const showError = useCallback(() => {
    Alert.alert('Unable to add to favourites', undefined, [{ text: 'OK' }]);
  }, []);

  const toggleFavourite = useCallback(async () => {
    if (authManager && !authManager.isLoggedIn) {
      navigationManager?.loginPromptContext?.('signInToContinue');
      return;
    }

    if (!litter && !breeder) return;

    try {
      setIsLoading(true);
      await toggleFavorite(itemId, type);
    } catch (err) {
      console.warn('Favourite toggle failed', err);
      showError();
    } finally {
      setIsLoading(false);
    }
  }, [authManager, itemId, litter, breeder, navigationManager, showError, toggleFavorite, type]);


  if (variant === 'tab') {

    return (
      <Pressable
        onPress={toggleFavourite}
        style={({ pressed }) => [
          styles.tabWrapper,
          { opacity: pressed ? 0.8 : 1, backgroundColor: isLoading ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.75)' },
        ]}
        accessibilityLabel="Toggle favourite"
        accessibilityRole="button"
        disabled={isLoading}
      >
        <HeartIcon width={20} height={18} status={isFavourite ? 'normal' : 'disabled'} state="filled" />
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggleFavourite}
        style={styles.button}
        accessibilityLabel="Toggle favourite"
        accessibilityRole="button"
        disabled={isLoading}
      >
        <HeartIcon width={20} height={18} status={isFavourite ? 'normal' : 'disabled'} state="filled" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  icon: {
    width: 20,
    height: 18,
    tintColor: '#FF3366',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  tabWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});