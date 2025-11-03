import { Litter } from '@/app/types/home';
import React from 'react';
import { ScrollView } from 'react-native';
import LittersCardHome from './littersCard';


interface LittersListHomeProps {
  litters: Litter[];
}

export default function LittersListHome({ litters }: LittersListHomeProps) {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 20, marginTop: 40 }}>
      {litters.map((litter) => (
        <LittersCardHome key={litter.id} {...litter} />
      ))}
    </ScrollView>
  );
}