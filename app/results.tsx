import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { AlertCircle, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Switch, Text, View } from 'react-native';

export default function ResultsScreen() {
    const router = useRouter();
    const [showHeatmap, setShowHeatmap] = useState(false);

    const handleSave = () => {
        // Save to history logic
        router.replace('/(tabs)/history');
    };

    const handleRescan = () => {
        router.back();
    };

    return (
        <ScreenContainer scrollable>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/300' }}
                    style={styles.analyzedImage}
                />
                {showHeatmap && (
                    <View style={styles.heatmapOverlay} />
                )}
            </View>

            <View style={styles.content}>
                <Card style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                        <Text style={styles.label}>Benign Nevus</Text>
                        <View style={[styles.badge, styles.lowRiskBadge]}>
                            <Text style={styles.badgeText}>Low Risk</Text>
                        </View>
                    </View>
                    <Text style={styles.confidence}>Confidence: 98%</Text>

                    <View style={styles.heatmapToggle}>
                        <Text style={styles.toggleText}>Show AI Attention Heatmap</Text>
                        <Switch
                            value={showHeatmap}
                            onValueChange={setShowHeatmap}
                            trackColor={{ false: COLORS.border, true: COLORS.primary }}
                        />
                    </View>
                </Card>

                <Card style={styles.infoCard}>
                    <View style={styles.infoHeader}>
                        <AlertCircle size={20} color={COLORS.primary} />
                        <Text style={styles.infoTitle}>About this Condition</Text>
                    </View>
                    <Text style={styles.infoText}>
                        A common mole, or nevus, is a growth on the skin that develops when pigment cells (melanocytes) grow in a cluster. Most adults have between 10 and 40 common moles.
                    </Text>
                </Card>

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        DISCLAIMER: This is not a medical diagnosis. If you have concerns, please consult a dermatologist.
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        title="Save Result"
                        onPress={handleSave}
                        style={styles.saveButton}
                        icon={<Save size={20} color={COLORS.white} />}
                    />
                    <Button
                        title="Scan Again"
                        onPress={handleRescan}
                        variant="outline"
                    />
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        height: 300,
        width: '100%',
        backgroundColor: '#000',
        position: 'relative',
    },
    analyzedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    heatmapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 0, 0, 0.3)', // Mock heatmap
    },
    content: {
        padding: SPACING.l,
        marginTop: -SPACING.xl,
    },
    resultCard: {
        marginBottom: SPACING.l,
        padding: SPACING.l,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    label: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    badge: {
        paddingHorizontal: SPACING.m,
        paddingVertical: 4,
        borderRadius: 12,
    },
    lowRiskBadge: {
        backgroundColor: COLORS.success,
    },
    badgeText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: FONT_SIZE.xs,
    },
    confidence: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
    },
    heatmapToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.m,
    },
    toggleText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
    },
    infoCard: {
        marginBottom: SPACING.l,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    infoTitle: {
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
        marginLeft: SPACING.s,
        color: COLORS.text,
    },
    infoText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    disclaimer: {
        marginBottom: SPACING.l,
        padding: SPACING.m,
        backgroundColor: '#FFF3CD',
        borderRadius: BORDER_RADIUS.s,
    },
    disclaimerText: {
        color: '#856404',
        fontSize: FONT_SIZE.xs,
        textAlign: 'center',
    },
    actions: {
        gap: SPACING.m,
    },
    saveButton: {
        marginBottom: SPACING.s,
    }
});
