import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '../theme';

interface ScreenContainerProps {
    children: React.ReactNode;
    scrollable?: boolean;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    scrollable = false,
    style,
    contentContainerStyle
}) => {
    const Container = scrollable ? ScrollView : View;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <Container
                style={[styles.container, style]}
                contentContainerStyle={scrollable ? [styles.contentContainer, contentContainerStyle] : undefined}
            >
                {children}
            </Container>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        marginTop: 20,
    },
    contentContainer: {
        padding: SPACING.m,
        paddingBottom: SPACING.xxl,
    },
});
