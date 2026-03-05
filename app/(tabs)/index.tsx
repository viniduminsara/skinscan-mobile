import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/src/theme';
import { useRouter } from 'expo-router';
import { ChevronRight, Scan, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const handleNewScan = () => {
    router.push('/(tabs)/scan');
  };

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.username}>Vinidu Minsara</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>VM</Text>
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
      <Card style={styles.resultCard}>
        <View style={styles.resultRow}>
          <View style={styles.thumbnailPlaceholder} />
          <View style={styles.resultInfo}>
            <Text style={styles.conditionName}>Benign Nevus</Text>
            <Text style={styles.confidence}>98% Confidence • Yesterday</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, { backgroundColor: COLORS.success }]}>
                <Text style={styles.badgeText}>Low Risk</Text>
              </View>
            </View>
          </View>
          <ChevronRight size={24} color={COLORS.textSecondary} />
        </View>
      </Card>

      {/* Weekly Insights */}
      <Text style={styles.sectionTitle}>Weekly Activity</Text>
      <Card style={styles.chartCard}>
        <LineChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                data: [1, 2, 1, 3, 2, 4, 3]
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
        <Text style={styles.chartNote}>You've completed 16 scans this week.</Text>
      </Card>

      {/* Privacy Badge */}
      <View style={styles.privacyBadge}>
        <ShieldCheck size={16} color={COLORS.options} />
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
