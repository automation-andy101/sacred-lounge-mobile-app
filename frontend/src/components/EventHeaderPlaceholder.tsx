import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Ellipse, Circle, Line, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const HEIGHT = 220;

export default function EventHeaderPlaceholder() {
  return (
    <View style={styles.container}>
      <Svg width={width - 40} height={HEIGHT} viewBox={`0 0 ${width - 40} ${HEIGHT}`}>
        <Defs>
          <RadialGradient id="glow1" cx="50%" cy="60%" r="50%">
            <Stop offset="0%" stopColor="#5C3010" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#070302" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient id="glow2" cx="50%" cy="70%" r="30%">
            <Stop offset="0%" stopColor="#8B4A10" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#070302" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="candleGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#D4722A" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#070302" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height={HEIGHT} fill="#070302" />
        <Rect width="100%" height={HEIGHT} fill="url(#glow1)" />
        <Rect width="100%" height={HEIGHT} fill="url(#glow2)" />

        <Ellipse cx="50%" cy="75%" rx="160" ry="80" fill="url(#candleGlow)" />

        <Ellipse cx="25%" cy="80%" rx="40" ry="22" fill="#3A1A08" fillOpacity="0.6" />
        <Ellipse cx="22%" cy="82%" rx="18" ry="11" fill="#5C2A10" fillOpacity="0.5" />
        <Ellipse cx="75%" cy="80%" rx="40" ry="22" fill="#3A1A08" fillOpacity="0.6" />
        <Ellipse cx="78%" cy="82%" rx="18" ry="11" fill="#5C2A10" fillOpacity="0.5" />

        <Circle cx="15%" cy="88%" r="3" fill="#BD8950" fillOpacity="0.5" />
        <Circle cx="20%" cy="85%" r="2" fill="#BD8950" fillOpacity="0.4" />
        <Circle cx="35%" cy="90%" r="2.5" fill="#BD8950" fillOpacity="0.5" />
        <Circle cx="45%" cy="87%" r="2" fill="#BD8950" fillOpacity="0.3" />
        <Circle cx="55%" cy="87%" r="2" fill="#BD8950" fillOpacity="0.3" />
        <Circle cx="65%" cy="90%" r="2.5" fill="#BD8950" fillOpacity="0.5" />
        <Circle cx="80%" cy="85%" r="2" fill="#BD8950" fillOpacity="0.4" />
        <Circle cx="85%" cy="88%" r="3" fill="#BD8950" fillOpacity="0.5" />

        <Line x1="28%" y1="42%" x2="42%" y2="42%" stroke="#BD8950" strokeWidth="0.5" strokeOpacity="0.4" />
        <Line x1="58%" y1="42%" x2="72%" y2="42%" stroke="#BD8950" strokeWidth="0.5" strokeOpacity="0.4" />

        <SvgText x="50%" y="35%" textAnchor="middle" fontFamily="Georgia, serif" fontSize="20" fontWeight="300" fill="#BD8950" letterSpacing="6">
          SACRED LOUNGE
        </SvgText>
        <SvgText x="50%" y="45%" textAnchor="middle" fontFamily="Georgia, serif" fontSize="10" fill="#8B6235" letterSpacing="4">
          MANCHESTER
        </SvgText>
        <SvgText x="50%" y="57%" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fill="#6B4A25" letterSpacing="2" fontStyle="italic">
          Meditation · Music · Meaning
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4A3220',
  },
});
