import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FencedYardIcon } from './icons/FencedYardIcon';
import { LocalParkIcon } from './icons/LocalParkIcon';

export type OutdoorAccessType = 'Local Park' | 'Fenced Yard';

type OutdoorAccessOptionProps = {
    type: OutdoorAccessType;
    selected: boolean;
    onSelect: () => void;
};

const getIcon = (type: OutdoorAccessType, selected: boolean) => {
    const color = selected ? '#3171F7' : '#000';

    switch (type) {
        case 'Local Park':
            return <LocalParkIcon width={24} height={22} color={color} />;
        case 'Fenced Yard':
            return <FencedYardIcon width={26} height={21} color={color} />;
        default:
            return null;
    }
};

export const OutdoorAccessOption: React.FC<OutdoorAccessOptionProps> = ({
    type,
    selected,
    onSelect
}) => (
    <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={onSelect}
    >
        <View style={styles.iconContainer}>
            {getIcon(type, selected)}
        </View>
        <Text style={[styles.text, selected && styles.textSelected]}>
            {type}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DBDBDB',
    },
    cardSelected: {
        borderColor: '#3171F7',
        backgroundColor: '#F7F8FF',
    },
    iconContainer: {
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
        width: 28,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
    textSelected: {
        color: '#3171F7',
        fontWeight: '600',
    },
});