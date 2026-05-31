// src/screens/EventDetailScreen.tsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image, Linking, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRoute } from '@react-navigation/native';
import { eventsApi } from '../services/api';
import { Colors, Spacing, Radius } from '../theme/colors';

export default function EventDetailScreen() {
  const route = useRoute<any>();
  const { slug } = route.params;

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventsApi.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  if (!event) return null;

  const startDate = new Date(event.eventDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.headerImage} />
      ) : (
        <View style={[styles.headerImage, styles.headerPlaceholder]}>
          <Text style={styles.placeholderText}>❀</Text>
        </View>
      )}

      {/* Event Date Badge */}
      <View style={styles.body}>
        <View style={styles.dateBadgeRow}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeDay}>{format(startDate, 'EEE').toUpperCase()}</Text>
            <Text style={styles.dateBadgeNum}>{format(startDate, 'd')}</Text>
            <Text style={styles.dateBadgeMonth}>{format(startDate, 'MMM').toUpperCase()}</Text>
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>

        {/* Time */}
        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>🕐</Text>
          <Text style={styles.metaText}>
            {format(startDate, 'h:mm a')}
            {endDate ? ` – ${format(endDate, 'h:mm a')}` : ''}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>📍</Text>
          <Text style={styles.metaText}>{event.locationName}, {event.locationAddress}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Description */}
        <Text style={styles.description}>{event.description}</Text>

        {/* What to Expect */}
        {event.whatToExpect?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>What to expect</Text>
            {event.whatToExpect.map((item: string, i: number) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletIcon}>✦</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </>
        )}

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            {event.isFree ? 'Free entry' : `£${event.price}`}
          </Text>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => event.eventbriteUrl && Linking.openURL(event.eventbriteUrl)}
          activeOpacity={0.85}
        >
          <Text style={styles.reserveButtonText}>RESERVE YOUR SPACE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  headerImage: { width: '100%', height: 260 },
  headerPlaceholder: { backgroundColor: Colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 60, color: Colors.goldMuted },
  body: { padding: Spacing.lg },
  dateBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  dateBadge: {
    alignItems: 'center',
    backgroundColor: Colors.goldDim,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    minWidth: 52,
  },
  dateBadgeDay: { fontSize: 10, color: Colors.gold, fontWeight: '700', letterSpacing: 1 },
  dateBadgeNum: { fontSize: 28, color: Colors.goldLight, fontFamily: 'CinzelDecorative_400Regular', lineHeight: 32 },
  dateBadgeMonth: { fontSize: 10, color: Colors.gold, fontWeight: '700', letterSpacing: 1 },
  eventTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 26,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 32,
  },
  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: Spacing.sm },
  metaIcon: { fontSize: 14, marginTop: 2 },
  metaText: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  divider: { height: 1, backgroundColor: Colors.goldMuted, marginVertical: Spacing.lg },
  description: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 17,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    color: Colors.gold,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: Spacing.sm },
  bulletIcon: { color: Colors.gold, fontSize: 12, marginTop: 4 },
  bulletText: { fontSize: 15, color: Colors.textPrimary, flex: 1 },
  priceRow: { marginTop: Spacing.md },
  priceText: { fontSize: 15, color: Colors.gold, fontFamily: 'CormorantGaramond_500Medium' },
  ctaContainer: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  reserveButton: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: 12,
    color: Colors.background,
    letterSpacing: 3,
    fontWeight: '800',
  },
});
