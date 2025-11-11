import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Accordion from '../components/common/Accordion';
import LittersCard from '../components/home/featuredLitterCard';
import LifeSpanIcon from '../icons/lifeSpanIcon';
import SizeIcon from '../icons/sizeIcon';
import StarIcon from '../icons/starIcon';
import WeightIcon from '../icons/weightIcon';
import { Litter } from '../types/home';
import { RootStackParamList } from '../types/navigation';
import { apiGet } from '../utils/interceptor';

type BreedRouteProp = RouteProp<RootStackParamList, 'Breeds'>;

type HealthCheckup = {
    id: number;
    name: string;
    description: string;
};



type BreedCare = Record<string, string>;

type BreedResponse = {
    health_checkups: HealthCheckup[];
    litters: Litter[];
    care: BreedCare;
};


function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
    return (
        <View style={styles.statRow}>
            <View style={styles.leftColumn}>
                {icon}
                <Text style={styles.iconText}>{label}</Text>
            </View>
            <Text style={styles.statValue}>{value ?? 'N/A'}</Text>
        </View>
    );
}

function HealthCheckupItem({
    checkup,
    selected,
    onPress,
}: {
    checkup: HealthCheckup;
    selected: boolean;
    onPress: (c: HealthCheckup) => void;
}) {
    return (
        <TouchableOpacity
            onPress={() => onPress(checkup)}
            style={[styles.healthCheckupRow, selected && styles.activeRow]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
        >
            <StarIcon />
            <Text style={styles.checkupName}>{checkup.name}</Text>
        </TouchableOpacity>
    );
}



export default function BreedsScreen() {
    const route = useRoute<BreedRouteProp>();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Breeds'>>();
    const { breed } = route.params || {};
    const [data, setData] = useState<BreedResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCheckup, setSelectedCheckup] = useState<HealthCheckup | null>(null);

    useEffect(() => {
        const fetchBreedData = async () => {
            if (!breed?.id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await apiGet<BreedResponse>(`breed/${breed.id}/litters`);
                setData(response);
            } catch (err: any) {
                console.error('Error fetching breed data:', err);
                setError(err?.message ?? 'Failed to load breed information');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBreedData();
    }, [breed?.id]);

    const handleSelectCheckup = (checkup: HealthCheckup) => {
        setSelectedCheckup((prev) => (prev?.id === checkup.id ? null : checkup));
    };

    const litters = useMemo(() => data?.litters ?? [], [data]);
    const healthCheckups = useMemo(() => data?.health_checkups ?? [], [data]);
    if (!breed) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No breed selected.</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#152C70" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                {breed.img_url ? (
                    <Image source={{ uri: breed.img_url }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Text style={styles.placeholderText}>No Image Available</Text>
                    </View>
                )}
                <View style={{ width: '100%', alignItems: 'center', paddingHorizontal: 20 }}>

                    <Text style={styles.title}>Breed Overview</Text>
                    <Text style={styles.breedName} numberOfLines={1}>
                        {breed.name}
                    </Text>
                    <Text style={styles.breedDescription}>{breed.description ?? 'No description available.'}</Text>

                    <View style={styles.statsContainer}>
                        <StatRow icon={<SizeIcon />} label="Size:" value={breed.size ?? 'N/A'} />
                        <StatRow icon={<WeightIcon />} label="Weight:" value={breed.weight ?? 'N/A'} />
                        <StatRow icon={<LifeSpanIcon />} label="Life Span:" value={breed.lifespan ?? 'N/A'} />
                    </View>

                    <Text style={[styles.breedName, { marginTop: 24 }]}>Upcoming Litters</Text>
                    {litters.length > 0 ? (
                        litters.map((litter) => (
                            <TouchableOpacity
                                key={litter.id}
                                style={{
                                    marginBottom: 12,
                                    width: '100%',
                                    padding: 0,
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 1,
                                }}
                                onPress={() => {
                                    navigation.navigate('Litter', { litterId: litter.id });
                                }}
                                activeOpacity={0.85}
                            >
                                <LittersCard
                                    name={litter.name}
                                    image={litter.image_url}
                                    available_count={litter.puppies.filter(puppy => !puppy.booked).length.toString()}
                                    is_new={
                                        litter.created_at
                                            ? (new Date().getTime() - new Date(litter.created_at).getTime()) / (1000 * 60 * 60 * 24) <= 7
                                            : false
                                    }
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.statValue}>No upcoming litters available.</Text>
                    )}

                    <View style={styles.geneticsContainer}>
                        <Text style={[styles.breedName, { marginTop: 20 }]}>Genetic Testing</Text>
                        {healthCheckups.length > 0 ? (
                            <>
                                {healthCheckups.map((hc) => (
                                    <HealthCheckupItem
                                        key={hc.id}
                                        checkup={hc}
                                        selected={selectedCheckup?.id === hc.id}
                                        onPress={handleSelectCheckup}
                                    />
                                ))}

                                {selectedCheckup && (
                                    <View style={styles.selectedDetails}>
                                        <Text style={styles.selectedName}>{selectedCheckup.name}</Text>
                                        <Text style={styles.selectedDescription}>{selectedCheckup.description}</Text>
                                    </View>
                                )}
                            </>
                        ) : (
                            <Text style={styles.statValue}>No health checkup information available.</Text>
                        )}
                    </View>
                    {/* FAQ Accordion Example */}
                    <View style={{ marginTop: 32, width: '100%' }}>
                        <Text style={[styles.breedName, { marginBottom: 12 }]}>Care</Text>

                        {data?.care && Object.keys(data.care).length > 0 ? (
                            <Accordion
                                sections={Object.entries(data.care).map(([key, value]) => ({
                                    title: key,
                                    content: value || 'No information available.',
                                }))}
                            />
                        ) : (
                            <Text style={styles.statValue}>No care information available.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const LEFT_COLUMN_WIDTH = 140;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centerContent: { justifyContent: 'center', alignItems: 'center' },
    contentContainer: { paddingBottom: 40 },
    title: {
        fontSize: 13,
        fontFamily: 'Figtree_700Bold',
        textTransform: 'uppercase',
        color: '#95979E',
        textAlign: 'left',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    image: { width: '100%', height: 268, marginBottom: 20 },
    imagePlaceholder: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
    placeholderText: { fontSize: 16, fontFamily: 'Roboto', color: '#999' },
    breedName: { fontSize: 34, fontFamily: 'Recoleta', color: '#000', textAlign: 'left', alignSelf: 'flex-start', marginVertical: 16 },
    breedDescription: {
        fontSize: 16,
        lineHeight: 28,
        fontFamily: 'Roboto',
        color: '#020617',
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    statsContainer: { marginTop: 20, alignSelf: 'flex-start', width: '100%' },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        width: '100%',
    },
    leftColumn: {
        width: LEFT_COLUMN_WIDTH,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconText: { fontSize: 14, fontFamily: 'Figtree_700Bold', color: '#000', marginLeft: 8 },
    statValue: { fontSize: 14, fontFamily: 'Roboto', color: '#666', flex: 1, textAlign: 'left' },
    errorText: { fontSize: 16, fontFamily: 'Roboto', color: '#666', textAlign: 'center', marginTop: 40 },
    geneticsContainer: { marginTop: 30, alignSelf: 'flex-start', width: '100%' },
    healthCheckupRow: {
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        alignSelf: 'stretch',
    },
    checkupName: { fontSize: 14, fontFamily: 'Figtree_600SemiBold', color: '#000' },
    checkupDescription: { fontSize: 14, fontFamily: 'Roboto', color: '#666', lineHeight: 20 },
    activeRow: { backgroundColor: '#F3F7FF' },
    selectedDetails: { marginTop: 15, padding: 10, borderRadius: 8, alignSelf: 'stretch' },
    selectedName: { fontSize: 16, fontFamily: 'Figtree_600SemiBold', marginBottom: 6, lineHeight: 28 },
    selectedDescription: { fontSize: 14, color: '#555' },
});