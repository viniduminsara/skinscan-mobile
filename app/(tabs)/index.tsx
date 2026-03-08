import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChevronRight, Scan, ShieldCheck } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '@/src/providers/AuthProvider';
import { api } from '@/src/lib/api';

const { width } = Dimensions.get('window');

interface DashboardData {
  totalScans: number;
  thisMonthScans: number;
  lastScan: {
    date: string;
    prediction: {
      prediction: string;
      confidence: number;
      riskStatus?: number;
      heatmap?: string;
    } | null;
  } | null;
  monthlyCounts: { month: string; count: number }[];
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchDashboard = async () => {
        try {
          const response = await api.get<{ body: DashboardData }>('/dashboard');
          if (isActive) setDashboardData(response.body);
        } catch (error) {
          console.error('Failed to fetch dashboard data', error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchDashboard();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleNewScan = () => {
    router.push('/(tabs)/scan');
  };

  const formatConfidence = (conf: number) => {
    return (conf).toFixed(1) + '%';
  };

  const getRiskLabel = (risk?: number) => {
    if (risk === undefined || risk === null) return 'Unknown Risk';
    if (risk === 0) return 'Low Risk';
    if (risk === 1) return 'Medium Risk';
    return 'High Risk';
  };

  const getRiskColor = (risk?: number) => {
    if (risk === 0) return COLORS.success;
    if (risk === 1) return COLORS.warning;
    if (risk === 2) return COLORS.error;
    return COLORS.textSecondary;
  };

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Evening,</Text>
          <Text style={styles.username}>{user?.username || 'User'}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase() || 'U'}</Text>
        </View>
      </View>

      {/* Main Action - New Scan */}
      <Card
        style={styles.scanCard}
        onPress={handleNewScan}
      >
        <View style={styles.scanContent}>
          <View style={styles.scanTextContainer}>
            <Text style={styles.scanTitle}>New Skin Scan</Text>
            <Text style={styles.scanSubtitle}>Check your skin health instantly with AI</Text>
          </View>
          <View style={styles.scanIconContainer}>
            <Scan size={32} color={COLORS.white} />
          </View>
        </View>
      </Card>

      {/* Last Result */}
      <Text style={styles.sectionTitle}>Recent Analysis</Text>
      {loading ? (
        <ActivityIndicator style={{ marginVertical: SPACING.l }} color={COLORS.primary} />
      ) : dashboardData?.lastScan ? (
        <Card style={styles.resultCard} onPress={() => router.push('/history')}>
          <View style={styles.resultRow}>
            <Image source={{ uri: `${dashboardData.lastScan.prediction?.heatmap}` }} style={styles.thumbnailPlaceholder} />
            <View style={styles.resultInfo}>
              <Text style={styles.conditionName}>{dashboardData.lastScan.prediction?.prediction || 'Unknown'}</Text>
              <Text style={styles.confidence}>
                {dashboardData.lastScan.prediction ? formatConfidence(dashboardData.lastScan.prediction.confidence) : 'N/A'} Confidence • {new Date(dashboardData.lastScan.date).toLocaleDateString()}
              </Text>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: getRiskColor(dashboardData.lastScan.prediction?.riskStatus) }]}>
                  <Text style={styles.badgeText}>{getRiskLabel(dashboardData.lastScan.prediction?.riskStatus)}</Text>
                </View>
              </View>
            </View>
            <ChevronRight size={24} color={COLORS.textSecondary} />
          </View>
        </Card>
      ) : (
        <Card style={styles.resultCard}>
          <Text style={{ textAlign: 'center', color: COLORS.textSecondary }}>No recent scans found.</Text>
        </Card>
      )}

      {/* Weekly Insights */}
      <Text style={styles.sectionTitle}>Monthly Activity</Text>
      {loading ? (
        <ActivityIndicator style={{ marginVertical: SPACING.l }} color={COLORS.primary} />
      ) : dashboardData?.monthlyCounts && dashboardData.monthlyCounts.length > 0 ? (
        <Card style={styles.chartCard}>
          <LineChart
            data={{
              labels: dashboardData.monthlyCounts.map(m => m.month.split(' ')[0]),
              datasets: [
                {
                  data: dashboardData.monthlyCounts.map(m => m.count)
                }
              ]
            }}
            width={width - (SPACING.m * 2) - (SPACING.m * 2)} // Screen width - Screen Padding - Card Padding
            height={180}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: COLORS.primary
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          <Text style={styles.chartNote}>You've completed {dashboardData.thisMonthScans} scans this month.</Text>
        </Card>
      ) : (
        <Card style={styles.chartCard}>
          <Text style={{ textAlign: 'center', color: COLORS.textSecondary, paddingVertical: SPACING.l }}>No activity data available.</Text>
        </Card>
      )}

      {/* Privacy Badge */}
      <View style={styles.privacyBadge}>
        <ShieldCheck size={16} color={COLORS.success} />
        <Text style={styles.privacyText}>Federated Learning Active • Data on Device</Text>
      </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
    marginTop: SPACING.m,
  },
  greeting: {
    fontSize: FONT_SIZE.m,
    color: COLORS.textSecondary,
  },
  username: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.l,
    fontWeight: 'bold',
  },
  scanCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    minHeight: 120,
    justifyContent: 'center',
  },
  scanContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanTextContainer: {
    flex: 1,
    marginRight: SPACING.m,
  },
  scanTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  scanSubtitle: {
    fontSize: FONT_SIZE.s,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scanIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.l,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.s,
    marginTop: SPACING.s,
  },
  resultCard: {
    marginBottom: SPACING.l,
    padding: SPACING.m,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.s,
    backgroundColor: COLORS.border,
    marginRight: SPACING.m,
  },
  resultInfo: {
    flex: 1,
  },
  conditionName: {
    fontSize: FONT_SIZE.m,
    fontWeight: '600',
    color: COLORS.text,
  },
  confidence: {
    fontSize: FONT_SIZE.s,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  badge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  chartCard: {
    marginBottom: SPACING.l,
    alignItems: 'center',
  },
  chartNote: {
    fontSize: FONT_SIZE.s,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.m,
    marginBottom: SPACING.l,
    opacity: 0.7,
  },
  privacyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: SPACING.s,
  },
});
