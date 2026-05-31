// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ImageBackground, Linking, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { homeApi } from '../services/api';
import { Colors, Spacing, Radius } from '../theme/colors';

const LotusIcon = () => (
  <Text style={{ fontSize: 28, color: Colors.gold, textAlign: 'center' }}>❀</Text>
);

const Divider = () => (
  <View style={styles.divider} />
);

export default function HomeScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['home'],
    queryFn: homeApi.getHomeData,
  });

  const openEventbrite = (url?: string) => {
    if (url) Linking.openURL(url);
  };

  const formatEventDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day:   format(d, 'EEE').toUpperCase(),
      date:  format(d, 'd'),
      month: format(d, 'MMM').toUpperCase(),
      time:  format(d, 'h:mm a'),
    };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <LotusIcon />
        <Text style={styles.brandName}>SACRED LOUNGE</Text>
        <Text style={styles.tagline}>Meditation · Music · Meaning</Text>
        <Divider />
        <Text style={styles.heroSubtitle}>Find deep calm{'\n'}in a busy world</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : (
        <>
          {/* Upcoming Event Card */}
          {data?.nextEvent && (() => {
            const ev = data.nextEvent;
            const fmt = formatEventDate(ev.eventDate);
            return (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>UPCOMING EVENT</Text>
                <View style={styles.eventCard}>
                  <View style={styles.eventDateBlock}>
                    <Text style={styles.eventDay}>{fmt.day}</Text>
                    <Text style={styles.eventDateNum}>{fmt.date}</Text>
                    <Text style={styles.eventMonth}>{fmt.month}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{ev.title}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaIcon}>🕐</Text>
                      <Text style={styles.metaText}>{fmt.time}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaIcon}>📍</Text>
                      <Text style={styles.metaText}>{ev.locationName}, {ev.locationAddress}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.reserveButton}
                  onPress={() => openEventbrite(ev.eventbriteUrl)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reserveButtonText}>RESERVE YOUR SPACE</Text>
                </TouchableOpacity>
              </View>
            );
          })()}

          {/* Today's Inspiration */}
          {data?.todaysInspiration && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Today's Inspiration</Text>
              <View style={styles.inspirationCard}>
                <Text style={styles.quoteMarks}>"</Text>
                <Text style={styles.quoteText}>{data.todaysInspiration.quote}</Text>
                <Text style={styles.quoteMarks} numberOfLines={1}>"</Text>
                <LotusIcon />
                {data.todaysInspiration.author && (
                  <Text style={styles.quoteAuthor}>— {data.todaysInspiration.author}</Text>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  brandName: {
    fontFamily: 'CinzelDecorative_400Regular',
    fontSize: 22,
    color: Colors.goldLight,
    letterSpacing: 4,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 16,
    color: Colors.gold,
    letterSpacing: 2,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: Colors.goldMuted,
    marginVertical: Spacing.lg,
  },
  heroSubtitle: {
    fontFamily: 'CormorantGaramond_400Italic',
    fontSize: 26,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: 'System',
    fontSize: 11,
    color: Colors.gold,
    letterSpacing: 3,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.goldMuted,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  eventDateBlock: {
    alignItems: 'center',
    minWidth: 52,
    borderRightWidth: 1,
    borderRightColor: Colors.goldMuted,
    paddingRight: Spacing.md,
    justifyContent: 'center',
  },
  eventDay: {
    fontSize: 11,
    color: Colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  eventDateNum: {
    fontSize: 32,
    color: Colors.goldLight,
    fontFamily: 'CinzelDecorative_400Regular',
    lineHeight: 36,
  },
  eventMonth: {
    fontSize: 11,
    color: Colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  eventInfo: {
    flex: 1,
    gap: 6,
  },
  eventTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 18,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  reserveButton: {
    marginTop: Spacing.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: 12,
    color: Colors.goldLight,
    letterSpacing: 3,
    fontWeight: '700',
  },
  inspirationCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.goldMuted,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quoteMarks: {
    fontSize: 32,
    color: Colors.goldMuted,
    fontFamily: 'CormorantGaramond_700Bold',
    lineHeight: 28,
    alignSelf: 'flex-start',
  },
  quoteText: {
    fontFamily: 'CormorantGaramond_400Italic',
    fontSize: 19,
    color: Colors.gold,
    textAlign: 'center',
    lineHeight: 28,
  },
  quoteAuthor: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'CormorantGaramond_400Regular',
    marginTop: 4,
  },
});
