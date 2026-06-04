import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const categoryEndpoint: Record<string, string> = {
  MEDITATION: '/library/meditations',
  KIRTAN:     '/library/kirtan',
  TALK:       '/library/talks',
};

export default function MediaList() {
  const { category, title } = useLocalSearchParams<{ category: string; title: string }>();
  const router = useRouter();

  const { data: items, isLoading } = useQuery({
    queryKey: ['library', category],
    queryFn: () => fetch(`${API_BASE}${categoryEndpoint[category] ?? '/library/meditations'}`).then(r => r.json()),
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color={S.gold} style={styles.loader} />
      ) : (
        <FlatList
          data={items ?? []}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>No content available yet.</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.trackRow}
              onPress={() => router.push({ pathname: '/player', params: { id: item.id, title: item.title, duration: item.durationSecs } })}
              activeOpacity={0.75}
            >
              <View style={styles.trackThumb}>
                <Text style={styles.trackThumbIcon}>🕯</Text>
              </View>
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.trackDesc} numberOfLines={1}>{item.description}</Text>
                )}
                <Text style={styles.trackDuration}>{item.formattedDuration}</Text>
              </View>
              <View style={styles.playBtn}>
                <Play size={14} color={S.gold} {...({} as any)} />
              </View>
            </TouchableOpacity>
          )}
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
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: S.bg,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  loader: {
    marginTop: 40,
  },
  separator: {
    height: 10,
  },
  empty: {
    textAlign: 'center',
    color: S.textMuted,
    marginTop: 40,
    fontSize: 15,
    fontStyle: 'italic',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: S.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: S.goldDim,
    padding: 14,
    gap: 14,
  },
  trackThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: S.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackThumbIcon: {
    fontSize: 20,
  },
  trackInfo: {
    flex: 1,
    gap: 3,
  },
  trackTitle: {
    fontSize: 15,
    color: S.text,
    fontWeight: '400',
  },
  trackDesc: {
    fontSize: 12,
    color: S.textMuted,
  },
  trackDuration: {
    fontSize: 12,
    color: S.gold,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: S.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
