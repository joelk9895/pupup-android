import React from 'react';
import {
    Button,
    InputAccessoryView,
    Keyboard,
    Platform,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

type PetsTextInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
};

const inputAccessoryViewID = 'doneAccessory';

export const PetsTextInput: React.FC<PetsTextInputProps> = ({
    value,
    onChangeText,
    placeholder,
}) => (
    <View style={styles.container}>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            inputAccessoryViewID={inputAccessoryViewID}
        />

        {/* This will only appear on iOS */}
        {Platform.OS === 'ios' && (
            <InputAccessoryView nativeID={inputAccessoryViewID}>
                <View style={styles.accessory}>
                    <Button title="Done" onPress={Keyboard.dismiss} color="#2563EB" />
                </View>
            </InputAccessoryView>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#000',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        minHeight: 300,
        lineHeight: 24,
    },
    accessory: {
        backgroundColor: '#F3F4F6',
        padding: 6,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        alignItems: 'flex-end',
    },
});
