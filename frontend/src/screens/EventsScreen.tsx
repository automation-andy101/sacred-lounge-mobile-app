// src/screens/EventsScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { eventsApi } from '../services/api';
import { Colors, Spacing, Radius } from '../theme/colors';

type Tab = 'upcoming' | 'past';

const EventRow = ({ event, onPress }: { event: any; onPress: () => void }) => {
  const d = new Date(event.eventDate);
  return (
    <TouchableOpacity style={styles.eventRow} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.datePill}>
        <Text style={styles.datePillDay}>{format(d, 'EEE').toUpperCase()}</Text>
        <Text style={styles.datePillNum}>{format(d, 'd')}</Text>
        <Text style={styles.datePillMonth}>{format(d, 'MMM').toUpperCase()}</Text>
      </View>
      <View style={styles.eventMeta}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🕐 {format(d, 'h:mm a')}
            {event.endDate ? ` – ${format(new Date(event.endDate), 'h:mm a')}` : ''}
          </Text>
        </View>
        <Text style={styles.metaText}>📍 {event.locationName}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

export default function EventsScreen() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const navigation = useNavigation<any>();

  const upcomingQuery = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: eventsApi.getUpcoming,
    enabled: tab === 'upcoming',
  });

  const pastQuery = useQuery({
    queryKey: ['events', 'past'],
    queryFn: () => eventsApi.getPast(0),
    enabled: tab === 'past',
  });

  const isLoading = tab === 'upcoming' ? upcomingQuery.isLoading : pastQuery.isLoading;
  const events = tab === 'upcoming'
    ? upcomingQuery.data ?? []
    : pastQuery.data?.content ?? [];

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {(['upcoming', 'past'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'upcoming' ? 'Upcoming' : 'Past Events'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventRow
              event={item}
              onPress={() => navigation.navigate('EventDetail', { slug: item.slug, title: item.title })}
            />
          )}
          contentContainerStyle={{ padding: Spacing.md }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>No events found.</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldMuted,
  },
  tab: {
    paddingBottom: Spacing.sm,
    marginRight: Spacing.lg,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.gold,
  },
  tabText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontFamily: 'CormorantGaramond_500Medium',
  },
  tabTextActive: {
    color: Colors.goldLight,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.goldMuted,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  datePill: {
    alignItems: 'center',
    minWidth: 48,
    backgroundColor: Colors.goldDim,
    borderRadius: Radius.sm,
    padding: Spacing.xs,
  },
  datePillDay: { fontSize: 10, color: Colors.gold, fontWeight: '700', letterSpacing: 1 },
  datePillNum: { fontSize: 26, color: Colors.goldLight, fontFamily: 'CinzelDecorative_400Regular', lineHeight: 30 },
  datePillMonth: { fontSize: 10, color: Colors.gold, fontWeight: '700', letterSpacing: 1 },
  eventMeta: { flex: 1, gap: 4 },
  eventTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 17,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 13, color: Colors.textSecondary },
  chevron: { fontSize: 24, color: Colors.goldMuted },
  separator: { height: Spacing.sm },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: Spacing.xl, fontFamily: 'CormorantGaramond_400Italic', fontSize: 16 },
});
