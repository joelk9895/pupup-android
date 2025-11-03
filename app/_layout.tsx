import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';

export default function RootLayout() {
    return (
        <>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <Stack
                screenOptions={{
                    headerShown: false, // Removes header and its safe area padding
                    contentStyle: { backgroundColor: 'transparent' },
                }}
            />
        </>
    );
}
