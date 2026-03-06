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
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = inAuthGroup && segments[1] === 'onboarding';

    if (!hasOnboarded) {
      if (!inOnboarding) {
        router.replace('/(auth)/onboarding');
      }
    } else if (!user) {
      if (!inAuthGroup || inOnboarding) {
        // Redir to sign-in if trying to access non-auth area but not logged in, OR trying to go back to onboarding if already onboarded
        router.replace('/(auth)/sign-in');
      }
    } else if (user && inAuthGroup) {
      // Redirect to tabs if logged in and inside auth group.
      router.replace('/(tabs)');
    }
  }, [user, isLoading, hasOnboarded, segments]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
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
