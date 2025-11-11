import FavouriteButton from '@/app/components/general/FavouriteButton';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo } from 'react';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface Breeder {
  id: number;
  name: string;
  background_img: string;
  description?: string;
}

interface FeaturedBreederHomeProps {
  breeder: Breeder | null;
}

const HEIGHT = 480;

function FeaturedBreederHome({ breeder }: FeaturedBreederHomeProps) {
  if (!breeder) return null;



  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: breeder.background_img }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        accessibilityRole="image"
        accessibilityLabel={`${breeder.name} background`}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />

        <View style={styles.favoriteButton}>
          <FavouriteButton
            id={breeder.id}
            breeder={breeder}
            variant="default"
          />
        </View>

        <View style={styles.overlay}>
          <Text style={styles.badge} accessibilityRole="text">
            Featured Breeder
          </Text>

          <Text
            style={styles.name}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityRole="header"
          >
            {breeder.name}
          </Text>

          <Text style={styles.description} numberOfLines={3}>
            {breeder.description}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

export default memo(FeaturedBreederHome);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginTop: 40,
    marginBottom: 40,
    width: '100%',
    height: HEIGHT,
    paddingHorizontal: 20,
  },
  imageBackground: {
    width: '100%',
    height: HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  imageStyle: {
    borderRadius: 12,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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

  overlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    paddingHorizontal: 0,
    paddingVertical: 8,
    borderRadius: 10,
    zIndex: 2,
  },
  badge: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});