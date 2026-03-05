import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, style, ...props }) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error ? styles.errorBorder : null]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[styles.input, icon ? styles.inputWithIcon : null, style]}
                    placeholderTextColor={COLORS.textSecondary}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.m,
    },
    label: {
        fontSize: FONT_SIZE.s,
        color: COLORS.text,
        marginBottom: SPACING.s,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.m,
        backgroundColor: COLORS.white,
        minHeight: 48,
    },
    iconContainer: {
        paddingLeft: SPACING.m,
    },
    input: {
        flex: 1,
        padding: SPACING.m,
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
    },
    inputWithIcon: {
        paddingLeft: SPACING.s,
    },
    errorBorder: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: FONT_SIZE.xs,
        marginTop: SPACING.xs,
    },
});
