import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type YesNoOptionProps = {
    value: 'yes' | 'no';
    label: string;
    selected: boolean;
    onSelect: () => void;
};

export const YesNoOption: React.FC<YesNoOptionProps> = ({
    value,
    label,
    selected,
    onSelect
}) => (
    <TouchableOpacity
        style={[styles.option, selected && styles.selectedOption]}
        onPress={onSelect}
    >
        <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    option: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 500,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#DBDBDB',
    },
    selectedOption: {
        borderColor: '#3171F7',
        backgroundColor: '#F7F8FF',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    selectedOptionText: {
        color: '#3171F7',
        fontWeight: '600',
    },
});