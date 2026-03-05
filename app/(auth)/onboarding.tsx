import { Button } from '@/src/components/Button';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { Scan, ShieldCheck, Smartphone } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'AI Skin Analysis',
        description: 'Get instant insights about your skin conditions using advanced AI technology directly on your device.',
        Icon: Scan,
    },
    {
        id: '2',
        title: 'Privacy First',
        description: 'Your data stays with you. We use federated learning so your personal images never leave your phone.',
        Icon: ShieldCheck,
    },
    {
        id: '3',
        title: 'Track Your Health',
        description: 'Keep a secure history of your scans and monitor changes over time with simple charts.',
        Icon: Smartphone,
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/(auth)/sign-in'); // Or sign-up
        }
    };

    const handleSkip = () => {
        router.replace('/(auth)/sign-in');
    };

    const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
        const IconComponent = item.Icon;
        return (
            <View style={styles.slide}>
                <View style={styles.iconContainer}>
                    <IconComponent size={80} color={COLORS.primary} />
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        );
    };

    return (
        <ScreenContainer style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Button title="Skip" variant="text" onPress={handleSkip} style={styles.skipButton} />
            </View>

            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                keyExtractor={(item) => item.id}
            />

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
                <Button
                    title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
                    onPress={handleNext}
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
    },
    header: {
        alignItems: 'flex-end',
        paddingHorizontal: SPACING.m,
    },
    skipButton: {
        paddingHorizontal: 0,
        minHeight: 0,
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xl,
    },
    iconContainer: {
        width: 200,
        height: 200,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.m,
    },
    description: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        padding: SPACING.l,
        paddingBottom: SPACING.xxl,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SPACING.l,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.border,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 20,
    },
});
