import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BreedListHome from './components/breedListHome';
import FeaturedBreederHome from './components/featuredBreederHome';
import Greetings from './components/greetings';
import LittersListHome from './components/LittersListHome';
import useFigtreeFonts from './utils/fontLoader';

interface Breed {
  id: number;
  name: string;
  img_url: string;
}

interface Litter {
  id: number;
  name: string;
  image_url: string;
  ready_date: string;
  // Add other fields if needed
}

interface Breeder {
  id: number;
  name: string;
  background_img: string;
  profile_img: string;
  description: string;
  location: string;
  is_featured: boolean;
  // Add other fields if needed
}

export default function Home() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [litters, setLitters] = useState<Litter[]>([]);
  const [featuredBreeder, setFeaturedBreeder] = useState<Breeder | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pupup-backend-72w39.ondigitalocean.app/home');
        const data = await response.json();
        setBreeds(data.breeds);
        setLitters(data.litters);
        const featured = data.breeders.find((breeder: Breeder) => breeder.is_featured);
        setFeaturedBreeder(featured || null);
      } catch (error) {
        console.error('Error fetching from backend:', error);
      }
    };
    fetchData();
  }, []);

  const { fontsLoaded } = useFigtreeFonts();

  if (!fontsLoaded) {
    return null; // Or a loading component
  }

  return (
    <ScrollView style={styles.container}>
      <Greetings />
      <BreedListHome breeds={breeds} />
      <LittersListHome litters={litters} />
      <FeaturedBreederHome breeder={featuredBreeder} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});