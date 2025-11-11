import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type ReasonType = 'Companionship' | 'Show' | 'Agility';

type ReasonOptionProps = {
    type: ReasonType;
    selected: boolean;
    onSelect: () => void;
};

export const ReasonOption: React.FC<ReasonOptionProps> = ({
    type,
    selected,
    onSelect
}) => (
    <TouchableOpacity
        style={[styles.pill, selected && styles.pillSelected]}
        onPress={onSelect}
    >
        <Text style={[styles.text, selected && styles.textSelected]}>
            {type}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    pill: {
        backgroundColor: '#F8F9FA',
        borderRadius: 500,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginRight: 4,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: '#DBDBDB',
    },
    pillSelected: {
        borderColor: '#3171F7',
        backgroundColor: '#F7F8FF',
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    textSelected: {
        color: '#3171F7',
        fontWeight: '600',
    },
});