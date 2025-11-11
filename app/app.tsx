import { NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from './context/AuthContext';
import { RootStackParamList } from './types/navigation';
import Application from './views/application';
import ApplicationSuccess from './views/ApplicationSuccess';
import LoginScreen from './views/auth/login';
import BreedsScreen from './views/breeds';
import Home from './views/home';
import LitterScreen from './views/litter';
import LitterFullScreen from './views/litterFullScreen';

export default function App() {
    const { isAuthenticated, isOnboarding } = useAuth();
    return (
        <NavigationIndependentTree>
            {(isAuthenticated && !isOnboarding) ? <AppNavigation /> : <LoginScreen />}
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
            <Stack.Screen
                name="Breeds"
                component={BreedsScreen}
                options={{
                    animation: 'default',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="Litter"
                component={LitterScreen}
                options={{
                    animation: 'default',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen name="Application" component={Application} />
            <Stack.Screen
                name="ApplicationSuccess"
                component={ApplicationSuccess}
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
        </Stack.Navigator>
    );
}