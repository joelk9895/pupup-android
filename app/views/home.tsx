import { RootStackParamList } from '@/app/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import BreedListHome from '../components/home/breedListHome';
import FeaturedBreederHome from '../components/home/featuredBreederHome';
import FeaturedLittersList from '../components/home/featuredLitter';
import Greetings from '../components/home/greetings';
import LittersListHome from '../components/home/littersList';
import PuppiesListHome from '../components/home/puppiesList';
import { Breed, Breeder, FeaturedLitter, HomeResponse, Litter, Puppies } from '../types/home';
import { APIError, apiGet } from '../utils/interceptor';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 0,
        paddingBottom: 20,
    },
});
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [litters, setLitters] = useState<Litter[]>([]);
    const [featuredBreeder, setFeaturedBreeder] = useState<Breeder[] | null>(null);
    const [featuredLitter, setFeaturedLitter] = useState<FeaturedLitter | null>(null);
    const [puppies, setPuppies] = useState<Puppies[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: HomeResponse = await apiGet<HomeResponse>('home');
                setBreeds(data.breeds);
                setLitters(data.litters);
                const featured = data.breeders.filter((breeder: Breeder) => breeder.is_featured); setFeaturedBreeder(featured.length > 0 ? featured : null);
                setFeaturedBreeder(featured.length > 0 ? featured : null);
                setFeaturedLitter(data.featured_litters || null);
                setPuppies(data.puppies || null)
            } catch (error) {
                if (error instanceof APIError) {
                    console.error('API Error fetching home data:', error.message, error.status);
                } else {
                    console.error('Error fetching home data:', error);
                }
            }
        };
        fetchData();
    }, []);

    return (

        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <Greetings />
                <BreedListHome breeds={breeds} />
                <LittersListHome litters={litters} />
                <FeaturedBreederHome breeder={featuredBreeder ? featuredBreeder[0] : null} />
                <FeaturedLittersList title={featuredLitter?.title || ""} description={featuredLitter?.description} litters={featuredLitter?.litters || []} />
                <PuppiesListHome puppies={puppies} />
                <FeaturedBreederHome breeder={featuredBreeder ? featuredBreeder[1] : null} />
            </ScrollView>
        </GestureHandlerRootView>
    );
}
