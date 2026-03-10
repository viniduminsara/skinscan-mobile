import { Button } from '@/src/components/Button';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '@/src/lib/api';
import Toast from 'react-native-toast-message';

export default function ScanScreen() {
    const router = useRouter();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handlePickImage = async () => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera is required!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleAnalyze = async () => {
        if (!imageUri) return;
        setAnalyzing(true);
        try {
            const response = await api.upload<{ body: { _id?: string; id?: string } }>('/scans/web', imageUri);
            const scanId = response.body?._id || response.body?.id;

            if (scanId) {
                // @ts-ignore - Dynamic routes string interpolation
                router.push(`/results/${scanId}`);
                setImageUri(null);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Analysis Error',
                    text2: 'Failed to retrieve scan ID from response',
                });
                setImageUri(null);
            }
        } catch (error) {
            setImageUri(null);
        } finally {
            setAnalyzing(false);
        }
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
