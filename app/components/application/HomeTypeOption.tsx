import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CondoIcon, HDBIcon, LandedIcon } from './icons';

export type HomeType = 'Condo' | 'HDB' | 'Landed';

type HomeTypeOptionProps = {
    type: HomeType;
    selected: boolean;
    onSelect: () => void;
};

const getIcon = (type: HomeType, selected: boolean) => {
    const color = selected ? '#3171F7' : '#000';
    const iconProps = { width: 24, height: 24, color };

    switch (type) {
        case 'Condo':
            return <CondoIcon {...iconProps} />;
        case 'HDB':
            return <HDBIcon {...iconProps} />;
        case 'Landed':
            return <LandedIcon {...iconProps} />;
        default:
            return null;
    }
};

export const HomeTypeOption: React.FC<HomeTypeOptionProps> = ({
    type,
    selected,
    onSelect
}) => (
    <TouchableOpacity
        style={[styles.homeTypeCard, selected && styles.homeTypeCardSelected]}
        onPress={onSelect}
    >
        <View style={styles.homeTypeIconContainer}>
            {getIcon(type, selected)}
        </View>
        <Text style={[styles.homeTypeText, selected && styles.homeTypeTextSelected]}>
            {type}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    homeTypeCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DBDBDB',
    },
    homeTypeCardSelected: {
        borderColor: '#3171F7',
        backgroundColor: '#F7F8FF',
    },
    homeTypeIconContainer: {
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeTypeText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    homeTypeTextSelected: {
        color: '#3171F7',
        fontWeight: '600',
    },
});