import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import EnterEmailScreen from '../components/login/enterEmail';
import EnterOtpScreen from './enterOtp';
import EnterEmailScreenSignup from './signup';
import StarterScreen from './starterScreen';

export type RootStackParamList = {
    Start: undefined;
    EnterEmailSignup: undefined;
    EnterEmail: undefined;
    EnterOtp: { email: string, name?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function LoginScreen() {
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
        </Stack.Navigator>
    );
}