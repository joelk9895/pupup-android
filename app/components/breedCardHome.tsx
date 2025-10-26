import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface BreedCardHomeProps {
    name: string;
    image: string;
}

export default function BreedCardHome({ name, image }: BreedCardHomeProps) {
    return (
       <View style={{ alignItems: 'center', height: 120, minWidth: 90, maxWidth: 90 }}>
         <View style={styles.card}>
            <Image
                source={{ uri: image }}
                style={styles.image}
            />
           
        </View>
        <Text style={styles.title}>{name}</Text>
       </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        maxWidth: 90,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 26,
    },
    title: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: 'Figtree_600SemiBold',
        textAlign: 'center',
        textOverflow: 'wrap',
        maxWidth: 90,
    },
});