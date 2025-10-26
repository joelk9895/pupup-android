import React from 'react';
import { ScrollView } from 'react-native';
import LittersCardHome from './LittersCardHome';

interface Litter {
  id: number;
  name: string;
  image_url: string;
  ready_date: string;
}

interface LittersListHomeProps {
  litters: Litter[];
}

export default function LittersListHome({ litters }: LittersListHomeProps) {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 20, marginTop: 40 }}>
      {litters.map((litter) => (
        <LittersCardHome key={litter.id} name={litter.name} image={litter.image_url} readyDate={litter.ready_date} />
      ))}
    </ScrollView>
  );
}