import { Redirect } from 'expo-router';

export default function Index() {
    // TODO: Check if onboarding is completed or user is logged in
    return <Redirect href="/(auth)/onboarding" />;
}
