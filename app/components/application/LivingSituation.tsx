import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type LivingSituationType = 'No' | 'My Partner' | 'Other Adults' | 'Young Kids' | 'Kids over 5';

type LivingSituationOptionProps = {
    type: LivingSituationType;
    selected: boolean;
    onSelect: () => void;
};

export const LivingSituationOption: React.FC<LivingSituationOptionProps> = ({
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
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#DBDBDB',
        minWidth: 100,
        alignItems: 'center',
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