import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/src/providers/AuthProvider';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { user, isLoading, hasOnboarded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until AuthProvider has finished checking AsyncStorage
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = inAuthGroup && segments[1] === 'onboarding';

    // 1. If user has NOT onboarded, they MUST go to onboarding regardless of auth state
    if (!hasOnboarded) {
      if (!inOnboarding) {
        router.replace('/(auth)/onboarding');
      }
      return; // Stop evaluating further rules
    }

    // 2. If user HAS onboarded but is NOT logged in, they MUST go to sign-in
    if (!user) {
      // If we are not in the auth group or we are in onboarding, redirect to signin
      if (!inAuthGroup || inOnboarding) {
        router.replace('/(auth)/sign-in');
      }
      return;
    }

    // 3. User HAS onboarded AND IS logged in
    if (inAuthGroup) {
      // If they try to go back to sign-in or onboarding while logged in, kick them to tabs
      router.replace('/(tabs)');
    }
  }, [user, isLoading, hasOnboarded, segments]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      <Stack.Screen name="results/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
