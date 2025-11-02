import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface LittersCardProps {
    name: string;
    image: string;
    available_count?: string;
    is_new?: boolean;
}

export default function LittersCard({ name, image, available_count, is_new }: LittersCardProps) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: image }} style={{ width: 99, height: 99, borderRadius: 8 }} />
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>{name}</Text>
                {available_count !== undefined && (
                    <Text style={styles.availableCount}>{available_count} puppies available</Text>
                )}

            </View>
            {is_new && (
                <View style={styles.newContainer}>

                    <Text style={styles.newText}>NEW</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#fff',
        width: '90%'
    },
    name: {
        fontSize: 15,
        fontFamily: 'Figtree_600SemiBold',
        maxWidth: 150,
    },
    availableCount: {
        fontSize: 12,
        fontFamily: 'Roboto',
        color: '#666',
    },
    infoContainer: {
        marginLeft: 10,
        height: 100,
        justifyContent: 'space-between',
        paddingVertical: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    newContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        position: 'absolute',
        top: 10,
        right: 10,
    },
    newText: {
        color: '#fff',
        fontSize: 10,
        lineHeight: 15,
        fontFamily: 'Figtree_700Bold',
    },
});