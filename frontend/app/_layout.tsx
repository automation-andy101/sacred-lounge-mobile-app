import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../src/context/AuthContext';
import { House, Calendar, Flower2, BookOpen, User } from 'lucide-react-native';

const C = {
  bg:     '#070302',
  gold:   '#BD8950',
  muted:  '#4A3220',
  border: '#2A1A0E',
};

const queryClient = new QueryClient();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const color = focused ? C.gold : C.muted;
  const size = 24;

  const iconMap: Record<string, React.ReactNode> = {
    Home:    React.createElement(House as any,     { size, color }),
    Events:  React.createElement(Calendar as any,  { size, color }),
    Explore: React.createElement(Flower2 as any,   { size, color }),
    Library: React.createElement(BookOpen as any,  { size, color }),
    Profile: React.createElement(User as any,      { size, color }),
  };

  return (
    <View style={styles.tabIcon}>
      {iconMap[label]}
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Tabs
          screenOptions={{
            headerStyle: { backgroundColor: C.bg },
            headerTintColor: C.gold,
            headerTitleStyle: { fontSize: 16, letterSpacing: 3, fontWeight: '300', color: C.gold },
            tabBarStyle: {
              backgroundColor: C.bg,
              borderTopColor: C.border,
              borderTopWidth: 1,
              height: 90,
              paddingBottom: 14,
              paddingTop: 10,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarShowLabel: false,
          }}
        >
          <Tabs.Screen name="index"        options={{ headerShown: false,  tabBarIcon: ({ focused }) => <TabIcon label="Home"    focused={focused} /> }} />
          <Tabs.Screen name="events"       options={{ title: 'Events',     tabBarIcon: ({ focused }) => <TabIcon label="Events"  focused={focused} /> }} />
          <Tabs.Screen name="experience"   options={{ title: 'Explore', tabBarIcon: ({ focused }) => <TabIcon label="Explore" focused={focused} /> }} />
          <Tabs.Screen name="library"      options={{ title: 'Library',    tabBarIcon: ({ focused }) => <TabIcon label="Library" focused={focused} /> }} />
          <Tabs.Screen name="profile"      options={{ title: 'Profile',    tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} /> }} />
          <Tabs.Screen name="event/[slug]" options={{ href: null, headerShown: false, }} />
          <Tabs.Screen name="media-list" options={{ href: null, headerShown: false }} />
          <Tabs.Screen name="player"     options={{ href: null, headerShown: false }} />
          <Tabs.Screen name="my-bookings" options={{ href: null, headerShown: false }} />
          <Tabs.Screen name="admin" options={{ href: null, headerShown: false }} />
          <Tabs.Screen name="settings" options={{ href: null, headerShown: false }} />
          <Tabs.Screen name="help" options={{ href: null, headerShown: false }} />
        </Tabs>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 48,
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: C.muted,
    letterSpacing: 0.5,
  },
  labelFocused: {
    color: C.gold,
  },
});
