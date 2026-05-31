import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '../src/theme/colors';

const experiences = [
  { icon: '❀', title: 'Guided Meditation', description: 'Calm the mind and connect within.' },
  { icon: '♪', title: 'Mantra Music & Kirtan', description: 'Soothing sounds to uplift the soul.' },
  { icon: '✦', title: 'Wisdom & Reflections', description: 'Meaningful talks to inspire clarity.' },
  { icon: '❤', title: 'Community & Connection', description: 'Share, connect and grow together.' },
  { icon: '☕', title: 'Tea & Refreshments', description: 'Relax and enjoy good company.' },
];

export default function ExperienceScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>Each Sacred Lounge event weaves together these elements into one transformative evening.</Text>
      {experiences.map((item) => (
        <TouchableOpacity key={item.title} style={styles.card} activeOpacity={0.75}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  intro: { fontFamily: 'CormorantGaramond_400Italic', fontSize: 16, color: Colors.textSecondary, marginBottom: Spacing.lg, lineHeight: 24, textAlign: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.goldMuted, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md },
  iconBox: { width: 48, height: 48, borderRadius: Radius.sm, backgroundColor: Colors.goldDim, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, color: Colors.gold },
  cardText: { flex: 1 },
  cardTitle: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 17, color: Colors.textPrimary, marginBottom: 2 },
  cardDesc: { fontSize: 13, color: Colors.textSecondary },
  chevron: { fontSize: 24, color: Colors.goldMuted },
});
