import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AlertCircle, Save, Trash2, Crosshair, ListChecks } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Switch, Text, View, Alert } from 'react-native';
import { api } from '@/src/lib/api';

interface ScanDetail {
    _id: string;
    imageString: string;
    result: {
        prediction: string;
        confidence: number;
        heatmap?: string;
        affectedArea?: number;
        riskStatus?: number;
    };
    suggestions?: string[];
}

export default function ResultsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [scanData, setScanData] = useState<ScanDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showHeatmap, setShowHeatmap] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchScanDetals = async () => {
            try {
                const response = await api.get<{ body: ScanDetail }>(`/scans/${id}`);
                setScanData(response.body);
            } catch (error) {
                console.error("Failed to load scan details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchScanDetals();
    }, [id]);

    const handleDelete = () => {
        Alert.alert(
            "Delete Scan",
            "Are you sure you want to delete this scan permanently?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/scans/${id}`);
                            router.back();
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            ]
        );
    };

    const handleRescan = () => {
        router.back();
    };

    const getRiskColor = (risk?: number) => {
        if (risk === 0) return COLORS.success;
        if (risk === 1) return '#f39c12';
        if (risk === 2) return COLORS.error;
        return COLORS.textSecondary;
    };

    const getRiskLabel = (risk?: number) => {
        if (risk === undefined || risk === null || risk === -1) return 'Unknown Risk';
        if (risk === 0) return 'Low Risk';
        if (risk === 1) return 'Medium Risk';
        return 'High Risk';
    };

    if (loading) {
        return (
            <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </ScreenContainer>
        );
    }

    if (!scanData) {
        return (
            <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: COLORS.textSecondary }}>Scan not found.</Text>
                <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: SPACING.m }} />
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer scrollable>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: scanData.imageString || 'https://via.placeholder.com/300' }}
                    style={styles.analyzedImage}
                />
                {showHeatmap && scanData.result?.heatmap && (
                    <Image
                        source={{ uri: scanData.result.heatmap }}
                        style={styles.heatmapOverlayImage}
                    />
                )}
            </View>

            <View style={styles.content}>
                <Card style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                        <Text style={styles.label}>{scanData.result?.prediction || 'Unknown'}</Text>
                        <View style={[styles.badge, { backgroundColor: getRiskColor(scanData.result?.riskStatus) }]}>
                            <Text style={styles.badgeText}>{getRiskLabel(scanData.result?.riskStatus)}</Text>
                        </View>
                    </View>
                    <Text style={styles.confidence}>Confidence: {scanData.result ? (scanData.result.confidence).toFixed(1) + '%' : 'N/A'}</Text>

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
                        This is an AI generated prediction based on visual similarities to known medical datasets. Always consult a healthcare professional for clinical advice.
                    </Text>
                </Card>

                {scanData.result?.affectedArea !== undefined && scanData.result.affectedArea !== null && (
                    <Card style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <Crosshair size={20} color={COLORS.primary} />
                            <Text style={styles.infoTitle}>Affected Area</Text>
                        </View>
                        <Text style={styles.infoText}>
                            The AI model estimates the affected region covers roughly {(scanData.result.affectedArea).toFixed(1)}% of the surface area provided.
                        </Text>
                    </Card>
                )}

                {scanData.suggestions && scanData.suggestions.length > 0 && (
                    <Card style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <ListChecks size={20} color={COLORS.primary} />
                            <Text style={styles.infoTitle}>Recommendations</Text>
                        </View>
                        {scanData.suggestions.map((suggestion, index) => (
                            <Text key={index} style={[styles.infoText, { marginBottom: SPACING.s }]}>
                                • {suggestion}
                            </Text>
                        ))}
                    </Card>
                )}

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        DISCLAIMER: This is not a medical diagnosis. If you have concerns, please consult a dermatologist.
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        title="Delete Scan"
                        onPress={handleDelete}
                        style={[styles.saveButton, { backgroundColor: COLORS.error }]}
                        icon={<Trash2 size={20} color={COLORS.white} />}
                    />
                    <Button
                        title="Go Back"
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
    heatmapOverlayImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        opacity: 0.6,
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
