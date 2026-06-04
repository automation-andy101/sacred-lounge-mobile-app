import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  FlatList, ActivityIndicator, StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Tab = 'upcoming' | 'past';

export default function Events() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const router = useRouter();

  const upcomingQuery = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => fetch(`${API_BASE}/events/upcoming`).then(r => r.json()),
  });

  const pastQuery = useQuery({
    queryKey: ['events', 'past'],
    queryFn: () => fetch(`${API_BASE}/events/past`).then(r => r.json()),
    enabled: tab === 'past',
  });

  const isLoading = tab === 'upcoming' ? upcomingQuery.isLoading : pastQuery.isLoading;
  const events = tab === 'upcoming'
    ? upcomingQuery.data ?? []
    : pastQuery.data?.content ?? [];

  return (
    <View style={styles.container}>

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
          <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>Past Events</Text>
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <ActivityIndicator color={S.gold} style={styles.loader} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>No events found.</Text>
          )}
          renderItem={({ item }) => {
            const d = new Date(item.eventDate);
            return (
              <TouchableOpacity
                style={styles.eventRow}
                onPress={() => router.push({ pathname: '/event/[slug]', params: { slug: item.slug } })}
                activeOpacity={0.75}
              >
                {/* Date pill */}
                <View style={styles.datePill}>
                  <Text style={styles.datePillDay}>{format(d, 'EEE').toUpperCase()}</Text>
                  <Text style={styles.datePillNum}>{format(d, 'd')}</Text>
                  <Text style={styles.datePillMonth}>{format(d, 'MMM').toUpperCase()}</Text>
                </View>

                {/* Info */}
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventMeta}>
                    🕐 {format(d, 'h:mm a')}
                    {item.endDate ? ` – ${format(new Date(item.endDate), 'h:mm a')}` : ''}
                  </Text>
                  <Text style={styles.eventMeta}>📍 {item.locationName}</Text>
                </View>

                <Text style={styles.chevron}>›</Text>
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
  goldMuted: '#8B6235',
  goldDim:   '#4A3220',
  text:      '#E8DDCF',
  textMuted: '#9C7D5E',
  border:    '#2A1A0E',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: S.bg,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: S.border,
  },
  tab: {
    paddingBottom: 12,
    marginRight: 24,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: S.gold,
  },
  tabText: {
    fontSize: 15,
    color: S.textMuted,
    fontWeight: '400',
  },
  tabTextActive: {
    color: S.gold,
  },

  // List
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  separator: {
    height: 10,
  },
  loader: {
    marginTop: 40,
  },
  empty: {
    textAlign: 'center',
    color: S.textMuted,
    marginTop: 40,
    fontSize: 16,
    fontStyle: 'italic',
  },

  // Event row
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  datePillDay: {
    fontSize: 10,
    color: S.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  datePillNum: {
    fontSize: 26,
    color: S.gold,
    fontWeight: '200',
    lineHeight: 30,
  },
  datePillMonth: {
    fontSize: 10,
    color: S.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  eventInfo: {
    flex: 1,
    gap: 5,
  },
  eventTitle: {
    fontSize: 16,
    color: S.text,
    lineHeight: 22,
    fontWeight: '400',
  },
  eventMeta: {
    fontSize: 12,
    color: S.textMuted,
  },
  chevron: {
    fontSize: 26,
    color: S.goldDim,
  },
});
