import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '../theme';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.m,
        padding: SPACING.m,
        ...SHADOWS.small,
    },
});
