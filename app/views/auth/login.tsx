import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import EnterEmailScreen from '../../components/login/enterEmail';
import { useAuth } from '../../context/AuthContext';
import EnterEmailScreenSignup from './signup';
import StarterScreen from '../starterScreen';
import EnterOtpScreen from './enterOtp';
import OnboardingScreen from './onboarding'

export type RootStackParamList = {
    Start: undefined;
    EnterEmailSignup: undefined;
    EnterEmail: undefined;
    EnterOtp: { email: string, name?: string };
    Onboarding: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function LoginScreen() {
    const navigation = useNavigation();
    const { isAuthenticated, isOnboarding } = useAuth();
    useEffect(() => {
        if (isAuthenticated && !isOnboarding) {
            navigation.navigate('Onboarding' as never);
        }
    }, []);
    return (
        <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 50,
                contentStyle: {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <Stack.Screen name='Start' component={StarterScreen} options={
                {
                    presentation: 'fullScreenModal'
                }
            } />
            <Stack.Screen name="EnterEmail" component={EnterEmailScreen} />
            <Stack.Screen name="EnterOtp" component={EnterOtpScreen} />
            <Stack.Screen name="EnterEmailSignup" component={EnterEmailScreenSignup} options={{
                animation: 'slide_from_right'
            }} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{
                animation: 'slide_from_right'
            }} />
        </Stack.Navigator>
    );
}