import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';

interface User {
    _id: string; // The backend uses mongoose _id usually, but let's check what the profile returns. We'll use any for now or a flexible type
    id?: string;
    name?: string;
    email: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    hasOnboarded: boolean;
    completeOnboarding: () => Promise<void>;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasOnboarded, setHasOnboarded] = useState(false);

    useEffect(() => {
        // Check for stored token on mount
        const loadSession = async () => {
            try {
                // Ensure onboarding state resolves first
                const onboarded = await AsyncStorage.getItem('hasCompletedOnboarding');
                if (onboarded === 'true') {
                    setHasOnboarded(true);
                }
            } catch (e) {
                console.error("Failed to read onboarding state", e);
            }

            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                if (storedToken) {
                    setToken(storedToken);
                    // Fetch profile to verify token
                    const response = await api.get<{ body: User }>('/users/profile');
                    setUser(response.body);
                }
            } catch (error) {
                console.error('Session restoration failed', error);
                // Clean up invalid session
                await AsyncStorage.removeItem('userToken');
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadSession();
    }, []);

    const completeOnboarding = async () => {
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setHasOnboarded(true);
    };

    const login = async (credentials: any) => {
        try {
            // Backend returns { success: true, message: "...", body: { user, token } } 
            // where body contains token
            const response = await api.post<{ body: { token: string; user: User } }>('/users/signin', credentials);
            const { token: newToken, user: newUser } = response.body;

            await AsyncStorage.setItem('userToken', newToken);
            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData: any) => {
        try {
            // Usually signup just creates the user, we might need to login right after or the backend returns token directly.
            // Let's assume it returns a token as well, or we just rely on sign in.
            // According to user.controller.ts, createNewUser returns data within the generic ResponseDTO's 'body' property.
            const response = await api.post<{ body: { token?: string; user: User } }>('/users/signup', userData);

            const newToken = response.body?.token;
            if (newToken) {
                await AsyncStorage.setItem('userToken', newToken);
                setToken(newToken);
                setUser(response.body.user);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, hasOnboarded, completeOnboarding, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
