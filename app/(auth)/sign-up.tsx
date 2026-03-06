import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { Input } from '@/src/components/Input';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/src/providers/AuthProvider';
import Toast from 'react-native-toast-message';

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, login } = useAuth();

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill all fields' });
            return;
        }

        setLoading(true);
        try {
            // Some backends expect username, some just name. Let's send both or map name to username
            await register({ username: name, email, password });

            // Wait a moment and login explicitly if register doesn't set token
            // In our case, register might not set the token if the backend doesn't return it
            // Let's rely on our AuthProvider's register function
            router.replace('/(tabs)');
        } catch (error: any) {
            // Handled globally in api.ts
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer scrollable contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Start your skin health journey today</Text>
            </View>

            <Card style={styles.formCard}>
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={name}
                    onChangeText={setName}
                    icon={<User size={20} color={COLORS.textSecondary} />}
                />
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon={<Mail size={20} color={COLORS.textSecondary} />}
                />
                <Input
                    label="Password"
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    icon={<Lock size={20} color={COLORS.textSecondary} />}
                />

                <Button
                    title="Sign Up"
                    onPress={handleSignUp}
                    loading={loading}
                    style={styles.signUpButton}
                />
            </Card>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        padding: SPACING.l,
        justifyContent: 'center',
    },
    header: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    subtitle: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    formCard: {
        padding: SPACING.l,
        marginBottom: SPACING.l,
    },
    signUpButton: {
        marginTop: SPACING.s,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.m,
    },
    footerLink: {
        color: COLORS.primary,
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
    },
});
