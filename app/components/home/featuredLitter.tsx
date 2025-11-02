import { Litter } from '@/app/types/home';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LittersCard from './featuredLitterCard';


interface LittersListProps {
    title: string;
    description?: string;
    litters: Litter[];
}

export default function FeaturedLittersList({ title, description, litters }: LittersListProps) {
    return (
        <View style={styles.container}>
            <LinearGradient colors={['#F4F4F400', '#F4F4F4']} style={styles.gradient} />
            <View style={styles.contentContainer}>
                <Text style={styles.badge}>ALL DOGS HEALTH CERTIFIED</Text>
                <Text style={styles.title}>{title}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
                <View style={styles.littersContainer}>
                    {litters.map((litter) => (
                        <LittersCard
                            key={litter.id}
                            name={litter.name}
                            image={litter.image_url}
                            available_count={litter.puppies.filter(puppy => !puppy.booked).length.toString()}
                            is_new={litter.created_at ? (new Date().getTime() - new Date(litter.created_at).getTime()) / (1000 * 60 * 60 * 24) <= 7 : false}
                        />
                    ))}
                </View>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#161C2D',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        mixBlendMode: 'overlay',
    },
    contentContainer: {
        padding: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Recoleta',
        color: '#fff',
        zIndex: 10,
        marginTop: 12,
    },
    description: {
        fontSize: 14,
        color: '#fff',
        lineHeight: 22,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginTop: 8,
    },
    littersContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 20,
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        color: '#171717',
        backgroundColor: '#9AA8BA',
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'center',
        fontSize: 12,
        fontWeight: '700',
        fontFamily: 'Figtree_700Bold',
        textTransform: 'uppercase',
        lineHeight: 23,
        borderWidth: 2,
        borderColor: '#E2E8F000',
        marginBlock: 16,
    },
});