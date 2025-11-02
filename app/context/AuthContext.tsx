import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthState {
    isAuthenticated: boolean;
    isOnboarding?: boolean;
    user: any;
    token: string | null;
}

interface AuthContextType extends AuthState {
    login: (user: any, token: string) => Promise<void>;
    logout: () => Promise<void>;
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
            if (token) {
                setAuthState({ isAuthenticated: true, user: JSON.parse(userData || '{}'), token });
            }
        };
        checkAuth();
    }, []);

    const login = async (user: any, token: string, onboarding: boolean) => {
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));

        setAuthState({ isAuthenticated: true, isOnboarding: onboarding, user, token });
    };

    const logout = async () => {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');
        setAuthState({ isAuthenticated: false, user: null, token: null });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;