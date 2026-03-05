import { Card } from '@/src/components/Card';
import { Input } from '@/src/components/Input';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { ChevronRight, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

// Mock History Data
const HISTORY_DATA = [
    { id: '1', date: 'Feb 15, 2026', label: 'Benign Nevus', confidence: '98%', risk: 'Low', image: 'https://via.placeholder.com/100' },
    { id: '2', date: 'Feb 10, 2026', label: 'Dermatofibroma', confidence: '92%', risk: 'Low', image: 'https://via.placeholder.com/100' },
    { id: '3', date: 'Jan 28, 2026', label: 'Actinic Keratosis', confidence: '85%', risk: 'Medium', image: 'https://via.placeholder.com/100' },
    { id: '4', date: 'Jan 15, 2026', label: 'Benign Nevus', confidence: '99%', risk: 'Low', image: 'https://via.placeholder.com/100' },
];

export default function HistoryScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const navigateToResult = (item: any) => {
        // In a real app, pass ID
        router.push('/results');
    };

    const renderItem = ({ item }: { item: typeof HISTORY_DATA[0] }) => (
        <Card
            style={styles.historyCard}
            onPress={() => navigateToResult(item)}
        >
            <View style={styles.cardRow}>
                <Image source={{ uri: item.image }} style={styles.thumbnail} />
                <View style={styles.cardInfo}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                    <View style={[
                        styles.riskBadge,
                        item.risk === 'Low' ? styles.lowRisk : styles.mediumRisk
                    ]}>
                        <Text style={styles.riskText}>{item.risk} Risk • {item.confidence}</Text>
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

            <FlatList
                data={HISTORY_DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
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
