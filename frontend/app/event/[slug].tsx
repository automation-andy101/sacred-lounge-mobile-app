import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, ActivityIndicator, Image, StyleSheet, Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import EventHeaderPlaceholder from '../../src/components/EventHeaderPlaceholder';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

export default function EventDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => fetch(`${API_BASE}/events/${slug}`).then(r => r.json()),
  });

  const { data: bookingStatus } = useQuery({
    queryKey: ['booking-status', event?.id],
    queryFn: async () => {
      const token = getToken();
      if (!token || !event?.id) return { success: false };
      const res = await fetch(`${API_BASE}/bookings/${event.id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!event?.id && !!getToken(),
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      const token = getToken();
      if (!token) throw new Error('Please sign in to reserve your space');
      const res = await fetch(`${API_BASE}/bookings/${event.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-status', event?.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      if (event?.eventbriteUrl) Linking.openURL(event.eventbriteUrl);
    },
    onError: (e: any) => {
      const msg = e.message ?? 'Could not complete booking';
      if (typeof window !== 'undefined') window.alert(msg);
      else Alert.alert('Error', msg);
    },
  });

  const handleReserve = () => {
    if (!getToken()) {
      const msg = 'Please sign in to reserve your space';
      if (typeof window !== 'undefined') window.alert(msg);
      else Alert.alert('Sign in required', msg);
      return;
    }
    bookMutation.mutate();
  };

  if (isLoading) return <View style={styles.centered}><ActivityIndicator color={S.gold} size="large" /></View>;
  if (!event) return null;

  const startDate = new Date(event.eventDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const isBooked = bookingStatus?.success;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ArrowLeft size={22} color={S.gold} {...({} as any)} />
        <Text style={styles.backBtnText}>Events</Text>
      </TouchableOpacity>

      <View style={styles.headerImageWrapper}>
        {event.imageUrl
          ? <Image source={{ uri: event.imageUrl }} style={styles.headerImage} resizeMode="cover" />
          : <EventHeaderPlaceholder />
        }
      </View>

      <View style={styles.body}>
        <View style={styles.dateTitleRow}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeDay}>{format(startDate, 'EEE').toUpperCase()}</Text>
            <Text style={styles.dateBadgeNum}>{format(startDate, 'd')}</Text>
            <Text style={styles.dateBadgeMonth}>{format(startDate, 'MMM').toUpperCase()}</Text>
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>🕐</Text>
          <Text style={styles.metaText}>{format(startDate, 'h:mm a')}{endDate ? ` – ${format(endDate, 'h:mm a')}` : ''}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>📍</Text>
          <Text style={styles.metaText}>{event.locationName}, {event.locationAddress}</Text>
        </View>

        <View style={styles.divider} />
        <Text style={styles.description}>{event.description}</Text>

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

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{event.isFree ? '✦ Free entry' : `£${event.price}`}</Text>
        </View>
      </View>

      <View style={styles.ctaContainer}>
        {isBooked ? (
          <View style={styles.bookedBadge}>
            <Text style={styles.bookedText}>✦ You're booked in!</Text>
            <TouchableOpacity onPress={() => event.eventbriteUrl && Linking.openURL(event.eventbriteUrl)}>
              <Text style={styles.bookedLink}>View on Eventbrite →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.reserveButton} onPress={handleReserve} activeOpacity={0.8} disabled={bookMutation.isPending}>
            {bookMutation.isPending
              ? <ActivityIndicator color={S.bg} />
              : <Text style={styles.reserveButtonText}>RESERVE YOUR SPACE</Text>
            }
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const S = { bg: '#070302', card: '#1A0F08', gold: '#BD8950', goldDim: '#4A3220', text: '#E8DDCF', textMuted: '#9C7D5E', success: '#5E9E6A' };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: S.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: S.bg },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, borderBottomWidth: 1, borderBottomColor: S.goldDim },
  backBtnText: { fontSize: 14, color: S.gold },
  headerImageWrapper: { paddingHorizontal: 20, paddingTop: 16 },
  headerImage: { width: '100%', height: 220, borderRadius: 12 },
  body: { padding: 20 },
  dateTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  dateBadge: { alignItems: 'center', backgroundColor: S.goldDim, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, minWidth: 52 },
  dateBadgeDay: { fontSize: 10, color: S.gold, fontWeight: '700', letterSpacing: 1 },
  dateBadgeNum: { fontSize: 26, color: S.gold, fontWeight: '200', lineHeight: 30 },
  dateBadgeMonth: { fontSize: 10, color: S.gold, fontWeight: '700', letterSpacing: 1 },
  eventTitle: { fontSize: 22, color: S.text, flex: 1, lineHeight: 28, fontWeight: '300' },
  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  metaIcon: { fontSize: 14, marginTop: 1 },
  metaText: { fontSize: 14, color: S.textMuted, flex: 1 },
  divider: { height: 1, backgroundColor: S.goldDim, marginVertical: 20 },
  description: { fontSize: 15, color: S.text, lineHeight: 24, marginBottom: 20, fontWeight: '300' },
  sectionTitle: { fontSize: 10, color: S.gold, letterSpacing: 3, fontWeight: '600', marginBottom: 12 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  bulletIcon: { color: S.gold, fontSize: 10, marginTop: 5 },
  bulletText: { fontSize: 14, color: S.text, flex: 1, lineHeight: 22 },
  priceRow: { marginTop: 16 },
  priceText: { fontSize: 14, color: S.gold, letterSpacing: 1 },
  ctaContainer: { padding: 20, paddingBottom: 40 },
  reserveButton: { backgroundColor: S.gold, borderRadius: 6, paddingVertical: 16, alignItems: 'center' },
  reserveButtonText: { fontSize: 12, color: S.bg, letterSpacing: 4, fontWeight: '700' },
  bookedBadge: { backgroundColor: S.card, borderRadius: 10, borderWidth: 1, borderColor: S.success, padding: 20, alignItems: 'center', gap: 10 },
  bookedText: { fontSize: 16, color: S.success, letterSpacing: 1 },
  bookedLink: { fontSize: 13, color: S.gold },
});
