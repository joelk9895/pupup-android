import { Puppies } from '@/app/types/home';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import PuppiesCard from './puppiesCard';


interface PuppiesListHomeProps {
    puppies: Puppies[];
}

export default function PuppiesListHome({ puppies }: PuppiesListHomeProps) {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require('@/assets/images/spotLight.png')} style={styles.spotlightImage} resizeMode='contain' />
            </View>
            <Text style={styles.title}>Puppy Spotlight</Text>
            <Text style={styles.description}>These puppies are growing, learning, and full of personality! Each one is unique, playful, and raised with care in a nurturing environment.</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginTop: 40, }}>
                {puppies.map((puppy, index) => (
                    <View key={puppy.id} style={{ marginRight: 12, marginLeft: index === 0 ? 20 : 0 }}>
                        <PuppiesCard puppies={puppy} />
                    </View>
                ))}
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        marginHorizontal: "5%",
        marginTop: 40,
        overflow: "hidden",
        borderColor: "#DADDE680",
        borderWidth: 2,
        borderRadius: 12,
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Figtree_600SemiBold',
        color: '#000',
        lineHeight: 30,
        marginHorizontal: 10,
    },
    description: {
        fontSize: 15,
        fontFamily: 'Roboto',
        color: '#000000',
        marginTop: 8,
        lineHeight: 22,
        marginHorizontal: 10,
    },
    spotlightImage: {
        width: '70%',
        height: 240,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: -1,
        opacity: 1,
    },
    imageContainer: {
        width: '100%',
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 20,
    }
})