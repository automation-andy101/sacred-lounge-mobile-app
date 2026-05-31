import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking, ActivityIndicator, ImageBackground, Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { homeApi } from '../services/api';
import { Colors, Spacing, Radius } from '../theme/colors';
import { Image } from 'react-native';

console.log('HomeScreen loading...');
const { height } = Dimensions.get('window');

const HERO_BG = require('../../assets/hero.jpg')

function LotusIcon({ size = 40, color = Colors.gold }: { size?: number; color?: string }) {
  return (
    <Text style={{ fontSize: size * 0.8, color, textAlign: 'center', lineHeight: size }}>
      ☸
    </Text>
  );
}

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
      timeStart: format(d, 'h:mm a'),
      timeEnd: '',
    };
  };

  const HeroContent = () => (
    <View style={styles.heroContent}>
      <LotusIcon size={48} color={Colors.gold} />
      <Text style={styles.brandName}>SACRED LOUNGE</Text>
      <Text style={styles.tagline}>Meditation · Music · Meaning</Text>
      <View style={styles.divider} />
      <Text style={styles.heroSubtitle}>Find deep calm{'\n'}in a busy world</Text>
    </View>
  );

  return (
    
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={require('../../assets/hero.jpg')} style={{ width: 100, height: 100 }} />
      {/* ── Hero ── */}
      {HERO_BG ? (
        <ImageBackground source={HERO_BG} style={styles.hero} resizeMode="cover">
          <View style={styles.heroDarkOverlay}>
            <HeroContent />
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.hero, styles.heroFallback]}>
          <HeroContent />
        </View>
      )}

      {/* ── Welcome ── */}
      <View style={styles.section}>
        <Text style={styles.welcomeHeading}>Welcome ☸</Text>
        <Text style={styles.welcomeText}>Take a pause. Reconnect.{'\n'}Be present.</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.gold} style={{ margin: Spacing.xl }} />
      ) : (
        <>
          {/* ── Upcoming Event ── */}
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
                      <Text style={styles.metaText}>{fmt.timeStart}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaIcon}>📍</Text>
                      <Text style={styles.metaText}>{ev.locationName},{'\n'}{ev.locationAddress}</Text>
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

          {/* ── Today's Inspiration ── */}
          {data?.todaysInspiration && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Today's Inspiration</Text>
              <View style={styles.inspirationCard}>
                <Text style={styles.quoteOpen}>"</Text>
                <Text style={styles.quoteText}>{data.todaysInspiration.quote}</Text>
                <Text style={styles.quoteClose}>"</Text>
                <LotusIcon size={28} color={Colors.gold} />
                {data.todaysInspiration.author && (
                  <Text style={styles.quoteAuthor}>— {data.todaysInspiration.author}</Text>
                )}
              </View>
            </View>
          )}
        </>
      )}

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Hero
  hero: { height: height * 0.6 },
  heroFallback: {
    backgroundColor: '#120A04',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroDarkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,6,2,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  brandName: {
    fontSize: 22,
    color: Colors.goldLight,
    letterSpacing: 6,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  tagline: {
    fontSize: 15,
    color: Colors.gold,
    letterSpacing: 2,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  divider: {
    width: 50,
    height: 1,
    backgroundColor: Colors.goldMuted,
    marginVertical: Spacing.lg,
  },
  heroSubtitle: {
    fontSize: 22,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    fontStyle: 'italic',
  },

  // Welcome
  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  welcomeHeading: { fontSize: 28, color: Colors.textPrimary, fontWeight: '300', marginBottom: Spacing.xs },
  welcomeText: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24, marginBottom: Spacing.sm },
  sectionLabel: { fontSize: 11, color: Colors.gold, letterSpacing: 3, marginBottom: Spacing.sm, fontWeight: '600' },

  // Event card
  eventCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.goldMuted,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  eventDateBlock: {
    alignItems: 'center',
    minWidth: 52,
    borderRightWidth: 1,
    borderRightColor: Colors.goldMuted,
    paddingRight: Spacing.md,
    justifyContent: 'center',
  },
  eventDay: { fontSize: 11, color: Colors.gold, fontWeight: '700', letterSpacing: 1 },
  eventDateNum: { fontSize: 32, color: Colors.goldLight, fontWeight: '200', lineHeight: 36 },
  eventMonth: { fontSize: 11, color: Colors.gold, fontWeight: '700', letterSpacing: 1 },
  eventInfo: { flex: 1, gap: 6 },
  eventTitle: { fontSize: 17, color: Colors.textPrimary, fontWeight: '500', lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  metaIcon: { fontSize: 12, marginTop: 1 },
  metaText: { fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 18 },

  // Reserve button
  reserveButton: {
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  reserveButtonText: { fontSize: 12, color: Colors.goldLight, letterSpacing: 3, fontWeight: '700' },

  // Inspiration
  inspirationCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.goldMuted,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  quoteOpen: { fontSize: 40, color: Colors.goldMuted, fontWeight: '700', alignSelf: 'flex-start', lineHeight: 32 },
  quoteText: { fontSize: 18, color: Colors.gold, textAlign: 'center', lineHeight: 28, fontStyle: 'italic' },
  quoteClose: { fontSize: 40, color: Colors.goldMuted, fontWeight: '700', alignSelf: 'flex-end', lineHeight: 32 },
  quoteAuthor: { fontSize: 13, color: Colors.textSecondary, marginTop: Spacing.xs, fontStyle: 'italic' },
});
