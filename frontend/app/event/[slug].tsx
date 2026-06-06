import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, ActivityIndicator, Image, StyleSheet, Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import EventHeaderPlaceholder from '../../src/components/EventHeaderPlaceholder';

const { height } = Dimensions.get('window');
const API_BASE = 'http://192.168.1.21:8080/api';

export default function EventDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => fetch(`${API_BASE}/events/${slug}`).then(r => r.json()),
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={S.gold} size="large" />
      </View>
    );
  }

  if (!event) return null;

  const startDate = new Date(event.eventDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <TouchableOpacity 
        style={styles.backBtn} 
        onPress={() => router.push('/events')}
      >
        <ArrowLeft size={22} color={'#BD8950'} {...({} as any)} />
        <Text style={styles.backBtnText}>Events</Text>
      </TouchableOpacity>

      {/* ── Header Image ── */}
      <View style={styles.headerImageWrapper}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.headerImage} resizeMode="cover" />
        ) : (
          <View style={styles.headerPlaceholder}>
            {/* <Image source={require('../../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" /> */}
            <EventHeaderPlaceholder />
          </View>
        )}
      </View>

      <View style={styles.body}>

        {/* ── Date + Title ── */}
        <View style={styles.dateTitleRow}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeDay}>{format(startDate, 'EEE').toUpperCase()}</Text>
            <Text style={styles.dateBadgeNum}>{format(startDate, 'd')}</Text>
            <Text style={styles.dateBadgeMonth}>{format(startDate, 'MMM').toUpperCase()}</Text>
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>

        {/* ── Time ── */}
        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>🕐</Text>
          <Text style={styles.metaText}>
            {format(startDate, 'h:mm a')}
            {endDate ? ` – ${format(endDate, 'h:mm a')}` : ''}
          </Text>
        </View>

        {/* ── Location ── */}
        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>📍</Text>
          <Text style={styles.metaText}>{event.locationName}, {event.locationAddress}</Text>
        </View>

        <View style={styles.divider} />

        {/* ── Description ── */}
        <Text style={styles.description}>{event.description}</Text>

        {/* ── What to expect ── */}
        {event.whatToExpect?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>WHAT TO EXPECT</Text>
            {event.whatToExpect.map((item: string, i: number) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletIcon}>✦</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </>
        )}

        {/* ── Price ── */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            {event.isFree ? '✦ Free entry' : `£${event.price}`}
          </Text>
        </View>
      </View>

      {/* ── CTA ── */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => event.eventbriteUrl && Linking.openURL(event.eventbriteUrl)}
          activeOpacity={0.8}
        >
          <Text style={styles.reserveButtonText}>RESERVE YOUR SPACE</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const S = {
  bg:        '#070302',
  card:      '#1A0F08',
  gold:      '#BD8950',
  goldMuted: '#8B6235',
  goldDim:   '#4A3220',
  text:      '#E8DDCF',
  textMuted: '#9C7D5E',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: S.bg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: S.bg,
  },

  // Header image
  headerImageWrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  // headerPlaceholder: {
  //   backgroundColor: S.card,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  placeholderIcon: {
    fontSize: 48,
  },

  // Body
  body: {
    padding: 20,
  },
  dateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  dateBadge: {
    alignItems: 'center',
    backgroundColor: S.goldDim,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 52,
  },
  dateBadgeDay: {
    fontSize: 10,
    color: S.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  dateBadgeNum: {
    fontSize: 26,
    color: S.gold,
    fontWeight: '200',
    lineHeight: 30,
  },
  dateBadgeMonth: {
    fontSize: 10,
    color: S.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  eventTitle: {
    fontSize: 22,
    color: S.text,
    flex: 1,
    lineHeight: 28,
    fontWeight: '300',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  metaIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  metaText: {
    fontSize: 14,
    color: S.textMuted,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: S.goldDim,
    marginVertical: 20,
  },
  description: {
    fontSize: 15,
    color: S.text,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '300',
  },
  sectionTitle: {
    fontSize: 10,
    color: S.gold,
    letterSpacing: 3,
    fontWeight: '600',
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  bulletIcon: {
    color: S.gold,
    fontSize: 10,
    marginTop: 5,
  },
  bulletText: {
    fontSize: 14,
    color: S.text,
    flex: 1,
    lineHeight: 22,
  },
  priceRow: {
    marginTop: 16,
  },
  priceText: {
    fontSize: 14,
    color: S.gold,
    letterSpacing: 1,
  },

  // CTA
  ctaContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  reserveButton: {
    backgroundColor: S.gold,
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: 12,
    color: S.bg,
    letterSpacing: 4,
    fontWeight: '700',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A1A0E',
  },
  backBtnText: {
  fontSize: 14,
  color: '#BD8950',
  },
  headerPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#1A0F08',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4A3220',
  },
  headerLogo: {
    width: 200,
    height: 80,
  },
});
