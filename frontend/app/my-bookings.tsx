import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft } from 'lucide-react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Tab = 'upcoming' | 'past';

export default function MyBookings() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const router = useRouter();

  const upcomingQuery = useQuery({
    queryKey: ['bookings', 'upcoming'],
    queryFn: async () => {
        const token = typeof window !== 'undefined' 
            ? localStorage.getItem('accessToken')
            : await AsyncStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE}/profile/bookings/upcoming`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },
  });

  const pastQuery = useQuery({
    queryKey: ['bookings', 'past'],
    queryFn: async () => {
        const token = typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : await AsyncStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE}/profile/bookings/past`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },                              
    enabled: tab === 'past',
  });

  const isLoading = tab === 'upcoming' ? upcomingQuery.isLoading : pastQuery.isLoading;
  const bookings = tab === 'upcoming'
    ? upcomingQuery.data ?? []
    : pastQuery.data ?? [];

  return (
      <View style={styles.container}>

        <View style={styles.backRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/profile')}>
                <ArrowLeft size={22} color={S.gold} {...({} as any)} />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
        </View>

        {/* ── Tabs ── */}
        <View style={styles.tabBar}>
            <TouchableOpacity
            style={[styles.tab, tab === 'upcoming' && styles.tabActive]}
            onPress={() => setTab('upcoming')}
            >
            <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.tab, tab === 'past' && styles.tabActive]}
            onPress={() => setTab('past')}
            >
            <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>Past</Text>
            </TouchableOpacity>
        </View>

        {isLoading ? (
            <ActivityIndicator color={S.gold} style={styles.loader} />
        ) : (
            <FlatList
            data={bookings}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🕯</Text>
                <Text style={styles.emptyTitle}>No bookings yet</Text>
                <Text style={styles.emptyText}>
                    {tab === 'upcoming'
                    ? 'Reserve your space at an upcoming Sacred Lounge event.'
                    : 'Your past events will appear here.'}
                </Text>
                {tab === 'upcoming' && (
                    <TouchableOpacity
                    style={styles.browseBtn}
                    onPress={() => router.push('/events')}
                    >
                    <Text style={styles.browseBtnText}>BROWSE EVENTS</Text>
                    </TouchableOpacity>
                )}
                </View>
            )}
            renderItem={({ item }) => {
                const d = new Date(item.event.eventDate);
                return (
                <TouchableOpacity
                    style={styles.bookingRow}
                    onPress={() => router.push({ pathname: '/event/[slug]', params: { slug: item.event.slug } })}
                    activeOpacity={0.75}
                >
                    <View style={styles.datePill}>
                    <Text style={styles.datePillDay}>{format(d, 'EEE').toUpperCase()}</Text>
                    <Text style={styles.datePillNum}>{format(d, 'd')}</Text>
                    <Text style={styles.datePillMonth}>{format(d, 'MMM').toUpperCase()}</Text>
                    </View>
                    <View style={styles.bookingInfo}>
                    <Text style={styles.bookingTitle}>{item.event.title}</Text>
                    <Text style={styles.bookingMeta}>🕐 {format(d, 'h:mm a')}</Text>
                    <Text style={styles.bookingMeta}>📍 {item.event.locationName}</Text>
                    <View style={[styles.statusBadge, item.status === 'CONFIRMED' && styles.statusConfirmed]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    </View>
                </TouchableOpacity>
                );
            }}
            />
        )}
    </View>
  );
}

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const S = {
  bg:        '#070302',
  card:      '#1A0F08',
  gold:      '#BD8950',
  goldDim:   '#4A3220',
  text:      '#E8DDCF',
  textMuted: '#9C7D5E',
  border:    '#2A1A0E',
  success:   '#5E9E6A',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: S.bg },

  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: S.border,
  },
  tab: { paddingBottom: 12, marginRight: 24 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: S.gold },
  tabText: { fontSize: 15, color: S.textMuted },
  tabTextActive: { color: S.gold },

  list: { padding: 20, paddingBottom: 40 },
  separator: { height: 10 },
  loader: { marginTop: 40 },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 18, color: S.text, fontWeight: '300', letterSpacing: 0.5 },
  emptyText: { fontSize: 14, color: S.textMuted, textAlign: 'center', lineHeight: 22, fontStyle: 'italic' },
  browseBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: S.gold,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  browseBtnText: { fontSize: 11, color: S.gold, letterSpacing: 3, fontWeight: '600' },

  bookingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: S.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: S.goldDim,
    padding: 14,
    gap: 14,
  },
  datePill: {
    alignItems: 'center',
    minWidth: 52,
    backgroundColor: S.goldDim,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  datePillDay: { fontSize: 10, color: S.gold, fontWeight: '700', letterSpacing: 1 },
  datePillNum: { fontSize: 26, color: S.gold, fontWeight: '200', lineHeight: 30 },
  datePillMonth: { fontSize: 10, color: S.gold, fontWeight: '700', letterSpacing: 1 },
  bookingInfo: { flex: 1, gap: 4 },
  bookingTitle: { fontSize: 16, color: S.text, lineHeight: 22 },
  bookingMeta: { fontSize: 12, color: S.textMuted },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: S.goldDim,
  },
    statusConfirmed: { borderColor: S.success },
    statusText: { fontSize: 10, color: S.success, letterSpacing: 1 },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 8,
    },
    backText: {
        fontSize: 14,
        color: S.gold,
    },
    backRow: {
        borderBottomWidth: 1,
        borderBottomColor: S.border,
    },
});
