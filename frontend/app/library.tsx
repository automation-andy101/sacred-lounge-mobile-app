import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../src/services/api';
import { Colors, Spacing, Radius } from '../src/theme/colors';

function TrackRow({ item }: { item: any }) {
  return (
    <View style={styles.trackRow}>
      <View style={styles.trackThumb}>
        <Text style={styles.trackThumbIcon}>❀</Text>
      </View>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackDuration}>{item.formattedDuration}</Text>
      </View>
      <TouchableOpacity style={styles.playBtn}>
        <Text style={styles.playIcon}>▶</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function LibraryScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['library'], queryFn: libraryApi.getLibrary });

  if (isLoading) return <ActivityIndicator color={Colors.gold} style={{ marginTop: 60 }} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Featured */}
      {data?.featuredItem && (
        <View style={styles.featured}>
          <View style={styles.featuredThumb}>
            <Text style={styles.featuredIcon}>❀</Text>
          </View>
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredLabel}>Today's Meditation</Text>
            <TouchableOpacity style={styles.featuredPlay}>
              <Text style={styles.featuredPlayIcon}>▶</Text>
            </TouchableOpacity>
            <Text style={styles.featuredDuration}>{data.featuredItem.formattedDuration}</Text>
          </View>
        </View>
      )}

      {/* Meditations */}
      {data?.meditations?.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meditations</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View all</Text></TouchableOpacity>
          </View>
          {data.meditations.map((item: any) => <TrackRow key={item.id} item={item} />)}
        </>
      )}

      {/* Talks */}
      {data?.talks?.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Talks & Reflections</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View all</Text></TouchableOpacity>
          </View>
          {data.talks.map((item: any) => <TrackRow key={item.id} item={item} />)}
        </>
      )}

      {/* Kirtan */}
      {data?.kirtan?.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mantra & Kirtan</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View all</Text></TouchableOpacity>
          </View>
          {data.kirtan.map((item: any) => <TrackRow key={item.id} item={item} />)}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  featured: { height: 180, backgroundColor: Colors.backgroundCard, borderRadius: Radius.lg, marginBottom: Spacing.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.goldMuted, overflow: 'hidden' },
  featuredThumb: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  featuredIcon: { fontSize: 80, color: Colors.goldDim },
  featuredOverlay: { alignItems: 'center', gap: Spacing.sm },
  featuredLabel: { fontSize: 13, color: Colors.gold, letterSpacing: 2, fontWeight: '700' },
  featuredPlay: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  featuredPlayIcon: { fontSize: 20, color: Colors.background, marginLeft: 4 },
  featuredDuration: { fontSize: 12, color: Colors.textSecondary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.md },
  sectionTitle: { fontSize: 13, color: Colors.goldLight, letterSpacing: 2, fontWeight: '700' },
  viewAll: { fontSize: 13, color: Colors.gold },
  trackRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundCard, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.goldMuted, padding: Spacing.sm, marginBottom: Spacing.sm, gap: Spacing.sm },
  trackThumb: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.goldDim, alignItems: 'center', justifyContent: 'center' },
  trackThumbIcon: { fontSize: 18, color: Colors.goldMuted },
  trackInfo: { flex: 1 },
  trackTitle: { fontSize: 15, color: Colors.textPrimary, fontFamily: 'CormorantGaramond_500Medium' },
  trackDuration: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  playBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 12, color: Colors.gold, marginLeft: 2 },
});
