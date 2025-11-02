import { useAuth } from '@/app/context/AuthContext';
import React from 'react';
import { Button, Image, Text, View } from 'react-native';

export default function Greetings() {
    const { user, logout } = useAuth();

    return (
        <View style={{ alignSelf: 'stretch', width: '100%', marginTop: 32 }}>
            <Image
                source={require('@/assets/images/homeScreen.png')}
                style={{ width: '100%', margin: 0, objectFit: 'contain', height: 200 }}
            />
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <Text style={{ fontSize: 24, fontFamily: 'Recoleta', textAlign: 'left', marginBottom: 4 }}>Hi {user?.name || 'there'},</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Roboto', lineHeight: 24, color: '#666', textAlign: 'left' }}>
                    Browse certified breeders and upcoming litters, check health standards, and chat directly with breeders in-app.
                </Text>
            </View>
            <Button title="Get Started" onPress={() => { logout() }} />
        </View>
    );
}