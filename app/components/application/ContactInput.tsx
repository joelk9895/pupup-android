import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type ContactInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
};

export const ContactInput: React.FC<ContactInputProps> = ({
    value,
    onChangeText,
    placeholder
}) => (
    <View style={styles.container}>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        flex: 1,
        marginBottom: 300,
    },
    input: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#000',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        height: 56,
    },
});