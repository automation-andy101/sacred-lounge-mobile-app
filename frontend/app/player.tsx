import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function Player() {
  const { id, title, duration } = useLocalSearchParams<{ id: string; title: string; duration: string }>();
  const router = useRouter();
  const totalSecs = parseInt(duration ?? '900', 10);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSecs, setCurrentSecs] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch audio URL from library item
  useEffect(() => {
    if (id) {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
      fetch(`${API_BASE}/library/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(r => r.json())
        .then(data => {
          if (data.audioUrl) setAudioUrl(data.audioUrl);
        })
        .catch(() => setError('Could not load audio details'));
    }
  }, [id]);

  // Load and play audio
  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const loadAndPlay = async () => {
    if (!audioUrl) {
      setError('No audio file available for this meditation yet.');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setCurrentSecs(Math.floor((status.positionMillis ?? 0) / 1000));
            if (status.didJustFinish) {
              setIsPlaying(false);
              setCurrentSecs(0);
            }
          }
        }
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (e) {
      setError('Could not load audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (!sound) {
      await loadAndPlay();
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const seek = async (direction: 'back' | 'forward') => {
    if (!sound) return;
    const delta = direction === 'back' ? -15000 : 15000;
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      const newPos = Math.max(0, (status.positionMillis ?? 0) + delta);
      await sound.setPositionAsync(newPos);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progress = totalSecs > 0 ? (currentSecs / totalSecs) * (width - 40) : 0;

  return (
    <View style={styles.container}>

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ArrowLeft size={22} color={S.gold} {...({} as any)} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Album Art */}
      <View style={styles.artContainer}>
        <Text style={styles.artIcon}>🕯</Text>
        <Text style={styles.artLogo}>SACRED LOUNGE</Text>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Sacred Lounge</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progress }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(currentSecs)}</Text>
          <Text style={styles.timeText}>{formatTime(totalSecs)}</Text>
        </View>
      </View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => seek('back')} style={styles.skipBtn}>
          <SkipBack size={28} color={S.gold} {...({} as any)} />
          <Text style={styles.skipLabel}>15</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={togglePlay}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator color={S.bg} />
            : isPlaying
              ? <Pause size={32} color={S.bg} {...({} as any)} />
              : <Play size={32} color={S.bg} {...({} as any)} />
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => seek('forward')} style={styles.skipBtn}>
          <SkipForward size={28} color={S.gold} {...({} as any)} />
          <Text style={styles.skipLabel}>15</Text>
        </TouchableOpacity>
      </View>

      {!audioUrl && !error && (
        <Text style={styles.note}>
          Audio will play once a file is uploaded to this meditation in the admin panel.
        </Text>
      )}
    </View>
  );
}

const S = {
  bg:        '#070302',
  card:      '#1A0F08',
  gold:      '#BD8950',
  goldDim:   '#4A3220',
  text:      '#E8DDCF',
  textMuted: '#9C7D5E',
  error:     '#C0514A',
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: S.bg,
    alignItems: 'center', paddingHorizontal: 20,
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, alignSelf: 'flex-start', paddingTop: 16, paddingBottom: 8,
  },
  backText: { fontSize: 14, color: S.gold },
  artContainer: {
    width: width - 80, height: width - 80,
    borderRadius: 20, backgroundColor: S.card,
    borderWidth: 1, borderColor: S.goldDim,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 16, marginBottom: 32, gap: 12,
  },
  artIcon: { fontSize: 64 },
  artLogo: { fontSize: 14, color: S.gold, letterSpacing: 4, fontWeight: '300' },
  titleContainer: { alignItems: 'center', marginBottom: 32 },
  title: {
    fontSize: 22, color: S.text, fontWeight: '300',
    textAlign: 'center', letterSpacing: 0.5, marginBottom: 6,
  },
  subtitle: { fontSize: 13, color: S.textMuted, letterSpacing: 2 },
  progressContainer: { width: '100%', marginBottom: 40 },
  progressTrack: {
    width: '100%', height: 3, backgroundColor: S.goldDim,
    borderRadius: 2, marginBottom: 8, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: S.gold, borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontSize: 12, color: S.textMuted },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 32, marginBottom: 24 },
  skipBtn: { alignItems: 'center', gap: 2 },
  skipLabel: { fontSize: 10, color: S.gold, letterSpacing: 1 },
  playPauseBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: S.gold, alignItems: 'center', justifyContent: 'center',
  },
  errorText: {
    fontSize: 13, color: S.error, textAlign: 'center',
    marginBottom: 16, paddingHorizontal: 20,
  },
  note: {
    fontSize: 12, color: S.goldDim, textAlign: 'center',
    fontStyle: 'italic', lineHeight: 18, paddingHorizontal: 20,
  },
});
