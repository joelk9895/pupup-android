import { NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from './context/AuthContext';
import { RootStackParamList } from './types/navigation';
import LoginScreen from './views/auth/login';
import Home from './views/home';
import LitterFullScreen from './views/litterFullScreen';

export default function App() {
    const { isAuthenticated, isOnboarding } = useAuth();
    return (
        <NavigationIndependentTree>
            {(isAuthenticated && isOnboarding) ? <AppNavigation /> : <LoginScreen />}
        </NavigationIndependentTree>
    );
}


function AppNavigation() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                presentation: 'fullScreenModal',
                animation: 'default',
                animationDuration: 50,
                contentStyle: {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
                name="LitterFullScreen"
                component={LitterFullScreen}
                options={{
                    animation: 'default',
                    contentStyle: {
                        backgroundColor: '#000',
                    },
                }}
            />
        </Stack.Navigator>
    );
}