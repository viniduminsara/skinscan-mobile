import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { useAuth } from '@/src/providers/AuthProvider';
import { COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { ChevronRight, HardDrive, HelpCircle, LogOut, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const [federatedLearning, setFederatedLearning] = useState(true);
    const [localStorage, setLocalStorage] = useState(true);
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out", style: "destructive", onPress: () => {
                        router.replace('/(auth)/sign-in')
                        logout();
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "This action is permanent and cannot be undone. All your scans and models will be deleted. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { api } = require('@/src/lib/api');
                            await api.delete('/users/profile');
                            logout();
                            router.replace('/(auth)/sign-in');
                        } catch (e: any) {
                            Alert.alert('Error', 'Failed to delete account');
                        }
                    }
                }
            ]
        );
    };

    const handleClearData = () => {
        Alert.alert("Clear Data", "This will delete all your local scan history. This action cannot be undone.");
    };

    const SettingRow = ({ icon, title, value, onValueChange, type = 'toggle' }: any) => (
        <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
                {icon}
                <Text style={styles.settingLabel}>{title}</Text>
            </View>
            {type === 'toggle' ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                />
            ) : (
                <ChevronRight size={20} color={COLORS.textSecondary} />
            )}
        </View>
    );

    return (
        <ScreenContainer scrollable>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase() || 'U'}</Text>
                </View>
                <Text style={styles.name}>{user?.username || 'SkinScan User'}</Text>
                <Text style={styles.email}>{user?.email || 'N/A'}</Text>
                <Button
                    title="Edit Profile"
                    variant="outline"
                    onPress={() => { }}
                    style={styles.editButton}
                />
            </View>

            {/* Privacy Settings */}
            <Text style={styles.sectionHeader}>Privacy & Data</Text>
            <Card style={styles.card}>
                <SettingRow
                    icon={<Shield size={22} color={COLORS.primary} style={styles.icon} />}
                    title="Federated Learning"
                    value={federatedLearning}
                    onValueChange={setFederatedLearning}
                />
                <View style={styles.divider} />
                <SettingRow
                    icon={<HardDrive size={22} color={COLORS.primary} style={styles.icon} />}
                    title="Local Data Storage"
                    value={localStorage}
                    onValueChange={setLocalStorage}
                />
            </Card>

            {/* Data Management */}
            <Text style={styles.sectionHeader}>Data Management</Text>
            <Card style={styles.card}>
                <TouchableOpacity style={styles.actionRow} onPress={handleClearData}>
                    <Text style={styles.actionText}>Clear Local Data</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.actionRow} onPress={handleDeleteAccount}>
                    <Text style={[styles.actionText, styles.destructiveText]}>Delete Account</Text>
                </TouchableOpacity>
            </Card>

            {/* Support */}
            <Text style={styles.sectionHeader}>Support</Text>
            <Card style={styles.card}>
                <TouchableOpacity style={styles.menuRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <HelpCircle size={22} color={COLORS.textSecondary} style={styles.icon} />
                        <Text style={styles.menuText}>Help & Support</Text>
                    </View>
                    <ChevronRight size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.menuRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Shield size={22} color={COLORS.textSecondary} style={styles.icon} />
                        <Text style={styles.menuText}>Privacy Policy</Text>
                    </View>
                    <ChevronRight size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </Card>

            <Button
                title="Sign Out"
                variant="outline"
                onPress={handleLogout}
                style={styles.logoutButton}
                icon={<LogOut size={20} color={COLORS.error} />}
            />

            <Text style={styles.version}>Version 1.0.0</Text>

        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        paddingVertical: SPACING.l,
        marginBottom: SPACING.m,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.m,
        borderWidth: 4,
        borderColor: COLORS.white,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
            android: { elevation: 4 },
        }),
    },
    avatarText: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    name: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    email: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
    },
    editButton: {
        minHeight: 36,
        paddingVertical: 4,
        paddingHorizontal: SPACING.l,
    },
    sectionHeader: {
        fontSize: FONT_SIZE.m,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
        marginLeft: SPACING.s,
        textTransform: 'uppercase',
    },
    card: {
        marginBottom: SPACING.l,
        paddingVertical: 0,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.m,
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
    },
    icon: {
        marginRight: SPACING.m,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
    },
    actionRow: {
        paddingVertical: SPACING.m,
        alignItems: 'center',
    },
    actionText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.primary,
        fontWeight: '500',
    },
    destructiveText: {
        color: COLORS.error,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.m,
    },
    menuText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
    },
    logoutButton: {
        marginTop: SPACING.m,
        borderColor: COLORS.error,
    },
    version: {
        textAlign: 'center',
        marginTop: SPACING.l,
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.s,
    }
});
