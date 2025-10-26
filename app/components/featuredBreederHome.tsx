import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Breeder {
  id: number;
  name: string;
  background_img: string;
  profile_img: string;
  description: string;
  location: string;
  is_featured: boolean;
}

interface FeaturedBreederHomeProps {
  breeder: Breeder | null;
}

export default function FeaturedBreederHome({ breeder }: FeaturedBreederHomeProps) {
  if (!breeder) return null;

  return (
    <View style={{ alignItems: 'flex-start', marginTop: 40, marginBottom: 40, width: '100%', height: 480, paddingHorizontal: 20 }}>
      <View style={{ width: '100%', height: 480, position: 'relative' }}>
        <Image
          source={{ uri: breeder.background_img }}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayBadge}>Top Breeder</Text>
          <Text style={styles.overlayBreederName}>{breeder.name}</Text>
          <Text numberOfLines={3} style={styles.overlayText}>{breeder.description}</Text>
        </View>
        <LinearGradient
          colors={['transparent', 'black']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.dark}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 480,
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingHorizontal: 12,
    gap: 4,
    paddingVertical: 4,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    zIndex: 2,
    maxWidth: '90%',
  },
  overlayBadge: {
    color: 'white',
    backgroundColor: '#FFFFFF20',
    backdropFilter: 'blur(4px)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
    fontSize: 12,
    fontFamily: 'Figtree_700Bold',
    textTransform: 'uppercase',
  },
  overlayText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    width: '100%',
  },
  overlayBreederName: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Figtree_600SemiBold',
    width: '80%',
  },
  dark: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});