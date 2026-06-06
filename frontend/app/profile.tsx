import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, Alert, Image,
} from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Settings, Bookmark, Heart, Download, Bell, HelpCircle, ChevronRight, LogOut, Camera } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const LOGO = require('../assets/logo.png');

// ─── Login / Register Form ────────────────────────────────────────────────────
function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, firstName, lastName });
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.authContent}>
      <Image source={LOGO} style={styles.authLogo} resizeMode="contain" />
      <Text style={styles.authHeading}>
        {mode === 'login' ? 'Welcome Back' : 'Join Sacred Lounge'}
      </Text>
      <Text style={styles.authSubheading}>
        {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
      </Text>

      {mode === 'register' && (
        <>
          <TextInput style={styles.input} placeholder="First name" placeholderTextColor={S.textDisabled} value={firstName} onChangeText={setFirstName} autoCapitalize="words" />
          <TextInput style={styles.input} placeholder="Last name" placeholderTextColor={S.textDisabled} value={lastName} onChangeText={setLastName} autoCapitalize="words" />
        </>
      )}
      <TextInput style={styles.input} placeholder="Email address" placeholderTextColor={S.textDisabled} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={S.textDisabled} value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
        {loading
          ? <ActivityIndicator color={S.bg} />
          : <Text style={styles.submitBtnText}>{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
        <Text style={styles.switchText}>
          {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Profile View ─────────────────────────────────────────────────────────────
function ProfileView() {
  const { user, logout } = useAuth();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const router = useRouter();

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => Alert.alert('Coming soon', 'Camera access will be available in the full app build.') },
        { text: 'Choose from Library', onPress: () => Alert.alert('Coming soon', 'Photo library access will be available in the full app build.') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const menuItems = [
    { label: 'My Bookings',    icon: Bookmark,   onPress: () => router.push('/my-bookings') },
    { label: 'My Favourites',  icon: Heart,      onPress: () => {} },
    { label: 'Downloads',      icon: Download,   onPress: () => {} },
    { label: 'Notifications',  icon: Bell,       onPress: () => {} },
    { label: 'Settings',       icon: Settings,   onPress: () => {} },
    { label: 'Help & Support', icon: HelpCircle, onPress: () => {} },
    ...(user?.role === 'ADMIN' ? [{ label: 'Admin Panel', icon: Settings, onPress: () => router.push('/admin') }] : []),
  ];

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.profileContent}>

      {/* ── Header ── */}
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Profile</Text>
        <TouchableOpacity>
          <Settings size={22} color={S.gold} {...({} as any)} />
        </TouchableOpacity>
      </View>

      {/* ── Avatar ── */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleChangePhoto} style={styles.avatarWrapper} activeOpacity={0.8}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
          {/* Camera badge */}
          <View style={styles.cameraBadge}>
            <Camera size={14} color={S.bg} {...({} as any)} />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role === 'ADMIN' ? 'Admin' : 'Member'}</Text>
        </View>
      </View>

      {/* ── Menu ── */}
      <View style={styles.menuCard}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <item.icon size={18} color={S.gold} {...({} as any)} />
            <Text style={styles.menuItemText}>{item.label}</Text>
            <ChevronRight size={16} color={S.goldDim} {...({} as any)} />
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Sign out ── */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
        <LogOut size={16} color={S.error} {...({} as any)} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <ActivityIndicator color={S.gold} style={{ marginTop: 60 }} />;
  return user ? <ProfileView /> : <AuthForm />;
}

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const S = {
  bg:          '#070302',
  card:        '#1A0F08',
  gold:        '#BD8950',
  goldDim:     '#4A3220',
  text:        '#E8DDCF',
  textMuted:   '#9C7D5E',
  textDisabled:'#4A3220',
  border:      '#2A1A0E',
  error:       '#C0514A',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: S.bg,
  },

  // Auth
  authContent: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  authLogo: {
    width: 220,
    height: 90,
    marginTop: 20,
    marginBottom: 24,
  },
  authHeading: {
    fontSize: 24,
    color: S.text,
    fontWeight: '300',
    marginBottom: 6,
    letterSpacing: 1,
  },
  authSubheading: {
    fontSize: 14,
    color: S.textMuted,
    marginBottom: 28,
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    backgroundColor: S.card,
    borderWidth: 1,
    borderColor: S.goldDim,
    borderRadius: 8,
    padding: 14,
    color: S.text,
    fontSize: 15,
    marginBottom: 10,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: S.gold,
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: S.bg,
    fontWeight: '700',
    letterSpacing: 3,
    fontSize: 12,
  },
  switchText: {
    color: S.gold,
    marginTop: 20,
    fontSize: 14,
  },

  // Profile
  profileContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 24,
    color: S.gold,
    fontWeight: '300',
    letterSpacing: 1,
  },

  // Avatar
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: S.gold,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: S.card,
    borderWidth: 2,
    borderColor: S.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 32,
    color: S.gold,
    fontWeight: '300',
    letterSpacing: 2,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: S.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: S.bg,
  },
  userName: {
    fontSize: 20,
    color: S.text,
    fontWeight: '300',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 13,
    color: S.textMuted,
    marginBottom: 8,
  },
  roleBadge: {
    borderWidth: 1,
    borderColor: S.goldDim,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  roleText: {
    fontSize: 11,
    color: S.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Menu
  menuCard: {
    backgroundColor: S.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: S.goldDim,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: S.goldDim,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: S.text,
    fontWeight: '300',
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: S.error,
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  logoutText: {
    color: S.error,
    fontSize: 14,
    letterSpacing: 1,
  },
});
