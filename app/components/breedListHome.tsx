import React from 'react';
import { ScrollView } from 'react-native';
import BreedCardHome from './breedCardHome';

interface Breed {
  id: number;
  name: string;
  img_url: string;
}

interface BreedListHomeProps {
  breeds: Breed[];
}

export default function BreedListHome({ breeds }: BreedListHomeProps) {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 0, maxHeight: 150, display: 'flex', flexDirection: 'row', gap: 15 }}>
      {breeds.map((breed) => (
        <BreedCardHome key={breed.id} name={breed.name} image={breed.img_url} />
      ))}
    </ScrollView>
  );
}