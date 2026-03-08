import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = {
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_URL}${endpoint}`;

        // Get token from storage
        const token = await AsyncStorage.getItem('userToken');

        // Setup headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...((options.headers as Record<string, string>) || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorMsg = data.message || 'Something went wrong';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: errorMsg,
                });
                // return Promise.reject(new Error(errorMsg));
            }

            return data as T;
        } catch (error: any) {
            // If it's the error we already rejected above, it might be caught here if we used throw,
            // but since we return Promise.reject, it skips this catch.
            // This catch mostly handles network failures (e.g., fetch throws before resolving).
            Toast.show({
                type: 'error',
                text1: 'Network Error',
                text2: error?.message || 'Cannot reach the server',
            });
            return Promise.reject(error);
        }
    },

    get<T>(endpoint: string, options?: RequestInit) {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    },

    post<T>(endpoint: string, body: any, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    put<T>(endpoint: string, body: any, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    delete<T>(endpoint: string, options?: RequestInit) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    },

    async upload<T>(endpoint: string, imageUri: string, options?: RequestInit): Promise<T> {
        const url = `${API_URL}${endpoint}`;
        const token = await AsyncStorage.getItem('userToken');

        const headers: Record<string, string> = {
            ...((options?.headers as Record<string, string>) || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        // @ts-ignore - React Native FormData expects this specific shape for files
        formData.append('image', { uri: imageUri, name: filename, type });

        try {
            const response = await fetch(url, {
                ...options,
                method: 'POST',
                headers,
                body: formData,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorMsg = data.message || 'Upload failed';
                Toast.show({
                    type: 'error',
                    text1: 'Upload Error',
                    text2: errorMsg,
                });
                return Promise.reject(new Error(errorMsg));
            }

            return data as T;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Network Error',
                text2: error?.message || 'Cannot reach the server',
            });
            return Promise.reject(error);
        }
    }
};
