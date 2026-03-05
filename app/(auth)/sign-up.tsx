import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { Input } from '@/src/components/Input';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
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
