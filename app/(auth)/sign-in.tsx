import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { Input } from '@/src/components/Input';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <ScreenContainer scrollable contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to access your skin health history</Text>
            </View>

            <Card style={styles.formCard}>
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
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    icon={<Lock size={20} color={COLORS.textSecondary} />}
                />

                <View style={styles.forgotPasswordContainer}>
                    <TouchableOpacity>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title="Sign In"
                    onPress={handleSignIn}
                    loading={loading}
                    style={styles.signInButton}
                />
            </Card>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                    <Text style={styles.footerLink}>Sign Up</Text>
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
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: SPACING.m,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontSize: FONT_SIZE.s,
    },
    signInButton: {
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
