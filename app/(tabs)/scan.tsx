import { Button } from '@/src/components/Button';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanScreen() {
    const router = useRouter();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handlePickImage = () => {
        // Mock image for demo
        setImageUri('https://via.placeholder.com/300');
    };

    const handleTakePhoto = () => {
        // Mock camera
        Alert.alert('Camera', 'Opening camera...');
        setImageUri('https://via.placeholder.com/300');
    };

    const handleAnalyze = () => {
        if (!imageUri) return;
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            // Navigate to results
            router.push('/results');
        }, 2000);
    };

    return (
        <ScreenContainer style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Skin Analysis</Text>
                <Text style={styles.subtitle}>Capture a clear photo of the affected area</Text>
            </View>

            <View style={styles.previewContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                    <View style={styles.placeholder}>
                        <Camera size={64} color={COLORS.textSecondary} />
                        <Text style={styles.placeholderText}>No Image Selected</Text>
                    </View>
                )}
            </View>

            <View style={styles.controls}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
                        <View style={styles.iconCircle}>
                            <Camera size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.actionText}>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handlePickImage}>
                        <View style={styles.iconCircle}>
                            <ImageIcon size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.actionText}>Gallery</Text>
                    </TouchableOpacity>
                </View>

                {imageUri && (
                    <Button
                        title="Analyze with AI"
                        onPress={handleAnalyze}
                        loading={analyzing}
                        style={styles.analyzeButton}
                    />
                )}

                <Text style={styles.privacyNote}>
                    Images are processed locally and never uploaded to the cloud.
                </Text>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SPACING.l,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: SPACING.l,
        alignItems: 'center',
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    previewContainer: {
        flex: 1,
        marginVertical: SPACING.xl,
        borderRadius: BORDER_RADIUS.l,
        overflow: 'hidden',
        backgroundColor: '#F0F0F0',
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: SPACING.m,
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.m,
    },
    controls: {
        paddingBottom: SPACING.xl,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.l,
    },
    actionButton: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.s,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    actionText: {
        color: COLORS.text,
        fontSize: FONT_SIZE.s,
        fontWeight: '500',
    },
    analyzeButton: {
        width: '100%',
    },
    privacyNote: {
        textAlign: 'center',
        fontSize: 10,
        color: COLORS.textSecondary,
        marginTop: SPACING.m,
    }
});
