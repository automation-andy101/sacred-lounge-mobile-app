import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function Library() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: () => fetch(`${API_BASE}/library`).then(r => r.json()),
  });

  const goToPlayer = (item: any) => {
    router.push({ pathname: '/player', params: { id: item.id, title: item.title, duration: item.durationSecs ?? 900 } });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={S.gold} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── Today's Meditation (Featured) ── */}
      {data?.featuredItem && (
        <TouchableOpacity
          style={styles.featured}
          onPress={() => goToPlayer(data.featuredItem)}
          activeOpacity={0.85}
        >
          {/* Dark overlay */}
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredLabel}>Today's Meditation</Text>
            <View style={styles.featuredPlayBtn}>
              <Play size={28} color={S.bg} {...({} as any)} />
            </View>
            <Text style={styles.featuredDuration}>{data.featuredItem.formattedDuration}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* ── Meditations ── */}
      {data?.meditations?.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meditations</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          {data.meditations.slice(0, 3).map((item: any) => (
            <TrackRow key={item.id} item={item} onPress={() => goToPlayer(item)} />
          ))}
        </View>
      )}

      {/* ── Talks & Reflections ── */}
      {data?.talks?.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Talks & Reflections</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          {data.talks.slice(0, 3).map((item: any) => (
            <TrackRow key={item.id} item={item} onPress={() => goToPlayer(item)} showAuthor />
          ))}
        </View>
      )}

      {/* ── Mantra & Kirtan ── */}
      {data?.kirtan?.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mantra & Kirtan</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          {data.kirtan.slice(0, 3).map((item: any) => (
            <TrackRow key={item.id} item={item} onPress={() => goToPlayer(item)} />
          ))}
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function TrackRow({ item, onPress, showAuthor }: { item: any; onPress: () => void; showAuthor?: boolean }) {
  return (
    <TouchableOpacity style={styles.trackRow} onPress={onPress} activeOpacity={0.75}>
      {/* Thumbnail */}
      <View style={styles.trackThumb}>
        <Text style={styles.trackThumbIcon}>🕯</Text>
      </View>

      {/* Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        {showAuthor && (
          <Text style={styles.trackAuthor}>by Sacred Lounge</Text>
        )}
        <Text style={styles.trackDuration}>{item.formattedDuration}</Text>
      </View>

      {/* Play button */}
      <TouchableOpacity style={styles.playBtn} onPress={onPress}>
        <Play size={12} color={S.gold} {...({} as any)} />
      </TouchableOpacity>
    </TouchableOpacity>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: S.bg,
  },
  bottomPadding: {
    height: 40,
  },

  // Featured
  featured: {
    margin: 16,
    height: 180,
    borderRadius: 12,
    backgroundColor: S.card,
    borderWidth: 1,
    borderColor: S.goldDim,
    overflow: 'hidden',
  },
  featuredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7,3,2,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  featuredLabel: {
    fontSize: 14,
    color: S.text,
    letterSpacing: 2,
    fontWeight: '300',
  },
  featuredPlayBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: S.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredDuration: {
    fontSize: 12,
    color: S.textMuted,
    letterSpacing: 1,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    color: S.gold,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  viewAll: {
    fontSize: 13,
    color: S.gold,
  },

  // Track row
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: S.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: S.goldDim,
    padding: 10,
    marginBottom: 8,
    gap: 12,
  },
  trackThumb: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: S.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackThumbIcon: {
    fontSize: 18,
  },
  trackInfo: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontSize: 15,
    color: S.text,
    fontWeight: '400',
  },
  trackAuthor: {
    fontSize: 12,
    color: S.textMuted,
  },
  trackDuration: {
    fontSize: 12,
    color: S.textMuted,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: S.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
