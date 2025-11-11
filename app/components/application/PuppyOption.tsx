import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GenderIcon from '../../icons/genderIcon';

type AnimalSummary = {
    id: number;
    name: string;
    gender?: string;
    description?: string;
    image_url?: string;
    booked?: boolean;
    breed?: string;
};

type PuppyOptionProps = AnimalSummary & {
    selected: boolean;
    onSelect: () => void;
};

export const PuppyOption: React.FC<PuppyOptionProps> = ({
    selected,
    onSelect,
    name,
    gender,
    booked,
    image_url
}) => {
    const status = booked ? 'Unavailable - Reserved' : 'Available';
    const available = !booked;

    return (
        <TouchableOpacity
            style={[
                styles.optionCard,
                selected && styles.optionCardSelected,
                !available && styles.optionCardUnavailable,
            ]}
            disabled={!available}
            onPress={onSelect}
        >
            <View style={[
                styles.radioCircle,
                selected && styles.radioCircleSelected,
            ]}>
                {selected && <View style={styles.radioDot} />}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.optionTitle, !available && styles.optionTextUnavailable]}>
                    {name} <GenderIcon gender={gender || 'UNKNOWN'} />
                </Text>
                <Text style={[
                    styles.optionStatus,
                    !available && styles.optionTextUnavailable,
                ]}>{status}</Text>
            </View>
            {image_url && (
                <Image source={{ uri: image_url }} style={styles.puppyImage} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 12,
        borderRadius: 16,
        padding: 10,
        borderWidth: 2,
        borderColor: '#DBDBDB',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
        height: 90,
    },
    optionCardSelected: {
        borderColor: '#3171F7',
        backgroundColor: '#F7F8FF',
    },
    optionCardUnavailable: {
        opacity: 0.6,
    },
    radioCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: '#DBDBDB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: 'white',
    },
    radioCircleSelected: {
        borderColor: '#3171F7',
        backgroundColor: '#F7F8FF',
    },
    radioDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#3171F7',
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#020617',
    },
    optionStatus: {
        fontSize: 14,
        color: '#7A7A7A',
    },
    optionTextUnavailable: {
        color: '#7A7A7A',
    },
    puppyImage: {
        width: 48,
        height: 48,
        borderRadius: 12,
        marginLeft: 10,
    },
});