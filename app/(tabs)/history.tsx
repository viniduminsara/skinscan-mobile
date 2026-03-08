import { Card } from '@/src/components/Card';
import { Input } from '@/src/components/Input';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChevronRight, Search } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { api } from '@/src/lib/api';

interface ScanItem {
    id: string;
    date: string;
    result: {
        prediction: string;
        confidence: number;
        riskStatus?: number;
    };
    imageString?: string;
}

export default function HistoryScreen() {
    const router = useRouter();
    const [scans, setScans] = useState<ScanItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchScans = async () => {
                try {
                    const response = await api.get<{ body: ScanItem[] }>('/scans/');
                    if (isActive) setScans(response.body);
                } catch (error) {
                    console.error('Failed to load history', error);
                } finally {
                    if (isActive) setLoading(false);
                }
            };
            fetchScans();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const navigateToResult = (item: ScanItem) => {
        router.push(`/results/${item.id}`);
    };

    const getRiskLabel = (risk?: number) => {
        if (risk === undefined || risk === null || risk === -1) return 'Unknown';
        if (risk === 0) return 'Low';
        if (risk === 1) return 'Medium';
        return 'High';
    };

    const isLowRisk = (risk?: number) => risk === 0;

    const filteredScans = scans.filter(scan =>
        scan.result?.prediction?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }: { item: ScanItem }) => (
        <Card
            style={styles.historyCard}
            onPress={() => navigateToResult(item)}
        >
            <View style={styles.cardRow}>
                {item.imageString ? (
                    <Image source={{ uri: `${item.imageString}` }} style={styles.thumbnail} />
                ) : (
                    <View style={styles.thumbnail} />
                )}
                <View style={styles.cardInfo}>
                    <Text style={styles.label}>{item.result?.prediction || 'Unknown'}</Text>
                    <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                    <View style={[
                        styles.riskBadge,
                        isLowRisk(item.result?.riskStatus) ? styles.lowRisk : styles.mediumRisk
                    ]}>
                        <Text style={styles.riskText}>{getRiskLabel(item.result?.riskStatus)} Risk • {item.result ? (item.result.confidence).toFixed(1) + '%' : 'N/A'}</Text>
                    </View>
                </View>
                <ChevronRight size={20} color={COLORS.textSecondary} />
            </View>
        </Card>
    );

    return (
        <ScreenContainer style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Scan History</Text>
            </View>

            <View style={styles.searchContainer}>
                <Input
                    placeholder="Search scans..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    icon={<Search size={20} color={COLORS.textSecondary} />}
                    style={styles.searchInput}
                />
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: SPACING.xl }} color={COLORS.primary} size="large" />
            ) : filteredScans.length > 0 ? (
                <FlatList
                    data={filteredScans}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={{ marginTop: SPACING.xl, alignItems: 'center' }}>
                    <Text style={{ color: COLORS.textSecondary }}>No scans found.</Text>
                </View>
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.m,
    },
    header: {
        paddingVertical: SPACING.l,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        marginBottom: SPACING.m,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    searchContainer: {
        marginBottom: SPACING.s,
    },
    searchInput: {
        backgroundColor: COLORS.white,
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
    historyCard: {
        marginBottom: SPACING.m,
        padding: SPACING.m,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.s,
        backgroundColor: COLORS.border,
        marginRight: SPACING.m,
    },
    cardInfo: {
        flex: 1,
    },
    label: {
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    date: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    riskBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    lowRisk: {
        backgroundColor: 'rgba(46, 204, 113, 0.1)', // Light green
    },
    mediumRisk: {
        backgroundColor: 'rgba(241, 196, 15, 0.1)', // Light yellow/orange
    },
    riskText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textSecondary, // Or specific color
    }
});
