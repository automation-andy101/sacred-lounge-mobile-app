import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, ActivityIndicator, Image, Dimensions,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const { height } = Dimensions.get('window');
const HERO_BG = require('../assets/hero.jpg');
const LOGO    = require('../assets/logo.png');

const API_URL = 'http://192.168.1.21:8080/api/home';

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['home'],
    queryFn: () => fetch(API_URL).then(r => r.json()),
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── Hero Image ── */}
      <View style={styles.heroWrapper}>
        <Image source={HERO_BG} style={styles.heroImage} resizeMode="cover" />
      </View>

      {/* ── Brand Block ── */}
      <View style={styles.brandBlock}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        <View style={styles.divider} />
        <Text style={styles.tagline}>Find deep calm{'\n'}in a busy world</Text>
      </View>

      {/* ── Spacer — pushes Welcome off initial screen ── */}
      <View style={styles.spacer} />

      {/* ── Welcome ── */}
      <View style={styles.section}>
        <Text style={styles.welcomeHeading}>Welcome</Text>
        <Text style={styles.welcomeText}>Take a pause. Reconnect. Be present.</Text>
      </View>

      {/* ── Loading ── */}
      {isLoading && <ActivityIndicator color={S.gold} style={styles.loader} />}

      {/* ── Upcoming Event ── */}
      {!isLoading && data?.nextEvent && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>UPCOMING EVENT</Text>
          <View style={styles.eventCard}>
            <View style={styles.eventDateBlock}>
              <Text style={styles.eventDay}>{format(new Date(data.nextEvent.eventDate), 'EEE').toUpperCase()}</Text>
              <Text style={styles.eventDateNum}>{format(new Date(data.nextEvent.eventDate), 'd')}</Text>
              <Text style={styles.eventMonth}>{format(new Date(data.nextEvent.eventDate), 'MMM').toUpperCase()}</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{data.nextEvent.title}</Text>
              <Text style={styles.eventMeta}>🕐 {format(new Date(data.nextEvent.eventDate), 'h:mm a')}</Text>
              <Text style={styles.eventMeta}>📍 {data.nextEvent.locationName}</Text>
              <Text style={styles.eventAddress}>{data.nextEvent.locationAddress}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.reserveButton}
            onPress={() => data.nextEvent.eventbriteUrl && Linking.openURL(data.nextEvent.eventbriteUrl)}
            activeOpacity={0.7}
          >
            <Text style={styles.reserveButtonText}>RESERVE YOUR SPACE</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Today's Inspiration ── */}
      {!isLoading && data?.todaysInspiration && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TODAY'S INSPIRATION</Text>
          <View style={styles.inspirationCard}>
            <Text style={styles.quoteOpen}>"</Text>
            <Text style={styles.quoteText}>{data.todaysInspiration.quote}</Text>
            <Text style={styles.quoteClose}>"</Text>
            <Text style={styles.quoteDivider}>✦</Text>
            {data.todaysInspiration.author && (
              <Text style={styles.quoteAuthor}>— {data.todaysInspiration.author}</Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

// ─── Brand tokens ────────────────────────────────────────────────────────────
const S = {
  bg:        '#070302',
  card:      '#1A0F08',
  gold:      '#BD8950',
  goldMuted: '#8B6235',
  goldDim:   '#4A3220',
  text:      '#E8DDCF',
  textMuted: '#9C7D5E',
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Layout
  container: {
    flex: 1,
    backgroundColor: S.bg,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  spacer: {
    height: 32,
  },
  loader: {
    margin: 20,
  },
  bottomPadding: {
    height: 40,
  },

  // Hero
  heroWrapper: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  heroImage: {
    width: '100%',
    height: height * 0.42,
    borderRadius: 16,
  },

  // Brand
  brandBlock: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  logo: {
    width: 340,
    height: 200,
    marginBottom: 8,
  },
  divider: {
    width: 30,
    height: 1,
    backgroundColor: S.goldDim,
    marginTop: 16,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 19,
    color: S.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 30,
    letterSpacing: 0.5,
  },

  // Welcome
  welcomeHeading: {
    fontSize: 24,
    color: S.text,
    fontWeight: '300',
    marginBottom: 6,
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: S.textMuted,
    lineHeight: 22,
  },

  // Section label
  sectionLabel: {
    fontSize: 10,
    color: S.gold,
    letterSpacing: 3,
    marginBottom: 10,
    fontWeight: '600',
  },

  // Event card
  eventCard: {
    backgroundColor: S.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: S.goldDim,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  eventDateBlock: {
    alignItems: 'center',
    minWidth: 52,
    borderRightWidth: 1,
    borderRightColor: S.goldDim,
    paddingRight: 16,
    justifyContent: 'center',
  },
  eventDay: {
    fontSize: 10,
    color: S.gold,
    fontWeight: '600',
    letterSpacing: 1,
  },
  eventDateNum: {
    fontSize: 30,
    color: S.gold,
    fontWeight: '200',
    lineHeight: 36,
  },
  eventMonth: {
    fontSize: 10,
    color: S.gold,
    fontWeight: '600',
    letterSpacing: 1,
  },
  eventInfo: {
    flex: 1,
    gap: 6,
  },
  eventTitle: {
    fontSize: 16,
    color: S.text,
    lineHeight: 22,
  },
  eventMeta: {
    fontSize: 12,
    color: S.textMuted,
  },
  eventAddress: {
    fontSize: 11,
    color: S.goldMuted,
  },

  // Reserve button
  reserveButton: {
    borderWidth: 1,
    borderColor: S.gold,
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: 11,
    color: S.gold,
    letterSpacing: 4,
    fontWeight: '600',
  },

  // Inspiration card
  inspirationCard: {
    backgroundColor: S.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: S.goldDim,
    padding: 20,
    alignItems: 'center',
  },
  quoteOpen: {
    fontSize: 34,
    color: S.goldDim,
    alignSelf: 'flex-start',
    lineHeight: 26,
    fontWeight: '700',
  },
  quoteText: {
    fontSize: 16,
    color: S.textMuted,
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  quoteClose: {
    fontSize: 34,
    color: S.goldDim,
    alignSelf: 'flex-end',
    lineHeight: 26,
    fontWeight: '700',
  },
  quoteDivider: {
    fontSize: 14,
    color: S.goldMuted,
    marginTop: 8,
  },
  quoteAuthor: {
    fontSize: 11,
    color: S.goldMuted,
    marginTop: 4,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});
