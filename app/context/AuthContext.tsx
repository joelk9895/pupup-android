import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthState {
    isAuthenticated: boolean;
    isOnboarding: boolean;
    user: any;
    token: string | null;
}

interface AuthContextType extends AuthState {
    login: (user: any, token: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: any) => Promise<void>;
    setOnboardingComplete: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isOnboarding: false,
        user: null,
        token: null,
    });

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('auth_token');
            const userData = await AsyncStorage.getItem('user_data');
            const onboardingComplete = await AsyncStorage.getItem('onboarding_complete');

            if (token && userData) {
                const user = JSON.parse(userData);
                setAuthState({
                    isAuthenticated: true,
                    isOnboarding: onboardingComplete === 'true',
                    user,
                    token
                });
            }
        };
        checkAuth();
    }, []);

    const login = async (user: any, token: string) => {
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));

        const hasCompletedOnboarding = user.onboarding_questions &&
            Object.keys(user.onboarding_questions).length > 0 &&
            user.onboarding_questions.looking;

        await AsyncStorage.setItem('onboarding_complete', hasCompletedOnboarding.toString());

        setAuthState({
            isAuthenticated: true,
            isOnboarding: hasCompletedOnboarding,
            user,
            token
        });
    };

    const updateUser = async (user: any) => {
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        setAuthState(prev => ({ ...prev, user }));
    };

    const setOnboardingComplete = async () => {
        await AsyncStorage.setItem('onboarding_complete', 'true');
        setAuthState(prev => ({ ...prev, isOnboarding: true }));
    };

    const logout = async () => {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');
        await AsyncStorage.removeItem('onboarding_complete');
        setAuthState({
            isAuthenticated: false,
            isOnboarding: false,
            user: null,
            token: null
        });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, updateUser, setOnboardingComplete }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;