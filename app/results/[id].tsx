import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AlertCircle, Save, Trash2, Crosshair, ListChecks, Download, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Switch, Text, View, Alert, Dimensions } from 'react-native';
import { api } from '@/src/lib/api';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { LineChart } from 'react-native-chart-kit';

interface ScanDetail {
    _id?: string;
    id?: string;
    date?: string;
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
    const [historyScans, setHistoryScans] = useState<ScanDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchScanDetals = async () => {
            try {
                const response = await api.get<{ body: ScanDetail }>(`/scans/${id}`);
                setScanData(response.body);

                const historyRes = await api.get<{ body: ScanDetail[] }>('/scans');
                if (historyRes.body) {
                    setHistoryScans(historyRes.body);
                }
            } catch (error) {
                console.error("Failed to load scan details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchScanDetals();
    }, [id]);

    const sameDiseaseScans = React.useMemo(() => {
        if (!scanData || historyScans.length === 0) return [];
        return historyScans
            .filter(s => s.result.prediction === scanData.result.prediction && s.result.affectedArea !== undefined && s.result.affectedArea !== null)
            .sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());
    }, [scanData, historyScans]);

    const showChart = sameDiseaseScans.length > 3;

    const chartLabels = sameDiseaseScans.map(s => {
        const d = new Date(s.date || 0);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const chartDataArray = sameDiseaseScans.map(s => s.result.affectedArea || 0);

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

    const handleGeneratePdf = async () => {
        if (!scanData) return;
        setGeneratingPdf(true);
        try {
            const riskLabel = getRiskLabel(scanData.result?.riskStatus);
            // Prepare HTML content
            const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
                        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                        .info-row { display: flex; justify-content: space-between; padding: 10px; background-color: #f8fafc; margin-bottom: 5px; border-radius: 5px; }
                        .images { display: flex; justify-content: space-between; margin-bottom: 20px; }
                        .images div { width: 48%; }
                        .images img { width: 100%; border-radius: 10px; }
                        .chart-placeholder { text-align: left; margin-top: 20px; padding: 20px; background-color: #f1f5f9; border-radius: 10px; }
                    </style>
                </head>
                <body>
                    <h1>SkinScan Analysis Report</h1>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                    
                    <div class="images">
                        <div>
                            <h3>Original Image</h3>
                            <img src="${scanData.imageString}" />
                        </div>
                        <div>
                            <h3>Heatmap Analysis</h3>
                            <img src="${scanData.result.heatmap || scanData.imageString}" />
                        </div>
                    </div>

                    <h2>Detection Results</h2>
                    <div class="info-row">
                        <strong>Condition:</strong>
                        <span>${scanData.result.prediction}</span>
                    </div>
                    <div class="info-row">
                        <strong>Confidence:</strong>
                        <span>${(scanData.result.confidence || 0).toFixed(1)}%</span>
                    </div>
                    ${scanData.result.affectedArea !== undefined && scanData.result.affectedArea !== null ? `
                    <div class="info-row">
                        <strong>Affected Area:</strong>
                        <span>${Number(scanData.result.affectedArea).toFixed(1)}%</span>
                    </div>
                    ` : ''}
                    <div class="info-row">
                        <strong>Risk Status:</strong>
                        <span>${riskLabel}</span>
                    </div>

                    ${showChart ? `
                    <div class="chart-placeholder">
                        <h3>Affected Area History</h3>
                        <p>There are ${sameDiseaseScans.length} previous scans for this condition.</p>
                        <ul>
                            <li><strong>Initial Affected Area:</strong> ${sameDiseaseScans[0].result.affectedArea}% on ${new Date(sameDiseaseScans[0].date || 0).toLocaleDateString()}</li>
                            <li><strong>Latest Affected Area:</strong> ${sameDiseaseScans[sameDiseaseScans.length - 1].result.affectedArea}% on ${new Date(sameDiseaseScans[sameDiseaseScans.length - 1].date || 0).toLocaleDateString()}</li>
                        </ul>
                    </div>
                    ` : ''}
                </body>
            </html>
            `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert("Error", "Sharing is not available on this device");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to generate PDF");
        } finally {
            setGeneratingPdf(false);
        }
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
                        <Text style={styles.label}>{scanData.result?.prediction === 'Unknown_Normal' ? 'Normal' : scanData.result?.prediction}</Text>
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

                <View style={styles.actions}>
                    <Button
                        title={generatingPdf ? "Generating..." : "Generate PDF Report"}
                        onPress={handleGeneratePdf}
                        disabled={generatingPdf}
                        style={[styles.saveButton, { backgroundColor: COLORS.success }]}
                        icon={generatingPdf ? <ActivityIndicator color={COLORS.white} /> : <Download size={20} color={COLORS.white} />}
                    />
                </View>

                {showChart && chartLabels.length > 0 && chartDataArray.length > 0 && (
                    <Card style={styles.chartCard}>
                        <View style={styles.infoHeader}>
                            <TrendingUp size={20} color={COLORS.primary} />
                            <Text style={styles.infoTitle}>Affected Area Over Time</Text>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: SPACING.m }}>
                            <LineChart
                                data={{
                                    labels: chartLabels,
                                    datasets: [{ data: chartDataArray }]
                                }}
                                width={Dimensions.get("window").width - SPACING.l * 2 - SPACING.l * 2}
                                height={220}
                                chartConfig={{
                                    backgroundColor: COLORS.white,
                                    backgroundGradientFrom: COLORS.white,
                                    backgroundGradientTo: COLORS.white,
                                    decimalPlaces: 1,
                                    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: { borderRadius: 16 },
                                    propsForDots: { r: "4", strokeWidth: "2", stroke: COLORS.primary }
                                }}
                                bezier
                                style={{ marginVertical: 8, borderRadius: 16, marginLeft: -SPACING.m }}
                            />
                        </View>
                    </Card>
                )}

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
    chartCard: {
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
        marginBottom: SPACING.l,
    },
    saveButton: {
        marginBottom: 0,
    }
});
