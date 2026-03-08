import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'text';
    loading?: boolean;
    disabled?: boolean;
    style?: any;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    icon
}) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    const containerStyles = [
        styles.container,
        isPrimary && styles.primaryContainer,
        isOutline && styles.outlineContainer,
        disabled && styles.disabledContainer,
        style,
    ];

    const textStyles = [
        styles.text,
        isPrimary && styles.primaryText,
        isOutline && styles.outlineText,
        disabled && styles.disabledText,
    ];

    return (
        <TouchableOpacity
            style={containerStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.primary} />
            ) : (
                <View style={styles.contentContainer}>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={textStyles}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.l,
        borderRadius: BORDER_RADIUS.m,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    primaryContainer: {
        backgroundColor: COLORS.primary,
    },
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    disabledContainer: {
        backgroundColor: COLORS.border,
        borderColor: COLORS.border,
    },
    text: {
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
    },
    primaryText: {
        color: COLORS.white,
    },
    outlineText: {
        color: COLORS.primary,
    },
    disabledText: {
        color: COLORS.textSecondary,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: SPACING.s,
    }
});
