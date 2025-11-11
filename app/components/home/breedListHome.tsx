import { Breed } from '@/app/types/home';
import { RootStackParamList } from '@/app/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import BreedCardHome from './breedCardHome';



interface BreedListHomeProps {
  breeds: Breed[];
}
type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


export default function BreedListHome({ breeds }: BreedListHomeProps) {
  const navigation = useNavigation<NavProp>();
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 0, maxHeight: 150, display: 'flex', flexDirection: 'row', gap: 15 }}>
      {breeds.map((breed) => (
        <TouchableOpacity key={breed.id} onPress={() => navigation.navigate('Breeds', { breed: breed })}>
          <BreedCardHome key={breed.id} name={breed.name} image={breed.img_url} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}