import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Headphones, Music, BookOpen, Users, Coffee } from 'lucide-react-native';


const experiences = [
  {
    id: 'guided-meditation',
    title: 'Guided Meditation',
    description: 'Calm the mind and connect within.',
    icon: 'headphones',
    category: 'MEDITATION',
    hasMedia: true,
  },
  {
    id: 'mantra-music-kirtan',
    title: 'Mantra Music & Kirtan',
    description: 'Soothing sounds to uplift the soul.',
    icon: 'music',
    category: 'KIRTAN',
    hasMedia: true,
  },
  {
    id: 'wisdom-reflections',
    title: 'Wisdom & Reflections',
    description: 'Meaningful talks to inspire clarity.',
    icon: 'book',
    category: 'TALK',
    hasMedia: true,
  },
  {
    id: 'community-connection',
    title: 'Community & Connection',
    description: 'Share, connect and grow together.',
    icon: 'users',
    category: null,
    hasMedia: false,
  },
  {
    id: 'tea-refreshments',
    title: 'Tea & Refreshments',
    description: 'Relax and enjoy good company.',
    icon: 'coffee',
    category: null,
    hasMedia: false,
  },
];

function ExperienceIcon({ icon, color, size }: { icon: string; color: string; size: number }) {
  const props = { size, color } as any;
  switch (icon) {
    case 'headphones': return <Headphones {...props} />;
    case 'music':      return <Music {...props} />;
    case 'book':       return <BookOpen {...props} />;
    case 'users':      return <Users {...props} />;
    case 'coffee':     return <Coffee {...props} />;
    default:           return <Headphones {...props} />;
  }
}

export default function ExperienceScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Each Sacred Lounge evening weaves together these sacred elements into one transformative experience.
      </Text>

      {experiences.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          activeOpacity={item.hasMedia ? 0.75 : 0.95}
          onPress={() => {
            if (item.hasMedia && item.category) {
              router.push({ pathname: '/media-list', params: { category: item.category, title: item.title } });
            }
          }}
        >
          {/* Icon box */}
          <View style={styles.iconBox}>
            <ExperienceIcon icon={item.icon} color={S.gold} size={22} />
          </View>

          {/* Text */}
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>

          {/* Chevron — only if tappable */}
          {item.hasMedia && <Text style={styles.chevron}>›</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 14,
    color: S.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: S.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: S.goldDim,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: S.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: S.text,
    fontWeight: '400',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 13,
    color: S.textMuted,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 26,
    color: S.goldDim,
  },
});
