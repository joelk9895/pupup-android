import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PuppyCountRow({
    totalPuppies,
    bookedPuppies,
    status,
    size = 'medium',
    showText = true
}: {
    totalPuppies: number;
    bookedPuppies: number;
    status?: 'AVAILABLE' | 'EXPECTED' | 'SOLD';
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
}) {
    const circleSize = size === 'small' ? 8 : size === 'medium' ? 14 : 12;
    const gap = size === 'small' ? 1 : size === 'medium' ? 2 : 3;

    return (
        <View style={styles.puppyCountContainer}>
            <View style={[styles.puppiesRow, { gap }]}>
                {Array.from({ length: totalPuppies }, (_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.puppyCircle,
                            { width: circleSize, height: circleSize, borderRadius: circleSize },
                            status === 'EXPECTED' && styles.dottedBorder,
                            index < bookedPuppies && styles.filledCircle,
                        ]}
                    />
                ))}
            </View>
            {showText && (
                <Text style={styles.litterInfo}>
                    {totalPuppies > 0
                        ? `${bookedPuppies}/${totalPuppies} Puppies Reserved`
                        : 'Accepting Expression of Interest'
                    }
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    puppyCountContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    puppiesRow: {
        flexDirection: 'row',
        marginVertical: 4,
        gap: 2,
    },
    puppyCircle: {
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: 'transparent',
    },
    dottedBorder: {
        borderStyle: 'dashed',
        borderWidth: 1,
    },
    filledCircle: {
        backgroundColor: '#000',
    },
    litterInfo: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
    },
});