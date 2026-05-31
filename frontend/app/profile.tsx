import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Colors, Spacing, Radius } from '../src/theme/colors';

function LoginForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, firstName, lastName });
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.logoText}>❀</Text>
      <Text style={styles.heading}>{mode === 'login' ? 'Welcome Back' : 'Join Sacred Lounge'}</Text>
      <Text style={styles.subheading}>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</Text>

      {mode === 'register' && (
        <>
          <TextInput style={styles.input} placeholder="First name" placeholderTextColor={Colors.textDisabled} value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Last name" placeholderTextColor={Colors.textDisabled} value={lastName} onChangeText={setLastName} />
        </>
      )}
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.textDisabled} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.textDisabled} value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.submitBtnText}>{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
        <Text style={styles.switchText}>
          {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProfileView() {
  const { user, logout } = useAuth();
  const menuItems = ['My Bookings', 'My Favourites', 'Downloads', 'Notifications', 'Settings', 'Help & Support'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>❀</Text>
        </View>
        <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.profileRole}>{user?.role === 'ADMIN' ? 'Admin' : 'Member'}</Text>
      </View>

      <View style={styles.menuCard}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={item} style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}>
            <Text style={styles.menuItemText}>{item}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function ProfileScreen() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <ActivityIndicator color={Colors.gold} style={{ marginTop: 60 }} />;
  return user ? <ProfileView /> : <LoginForm />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  logoText: { fontSize: 48, color: Colors.gold, textAlign: 'center', marginTop: Spacing.xl },
  heading: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 28, color: Colors.textPrimary, textAlign: 'center', marginTop: Spacing.sm },
  subheading: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, fontFamily: 'CormorantGaramond_400Italic' },
  input: { backgroundColor: Colors.backgroundInput, borderWidth: 1, borderColor: Colors.goldMuted, borderRadius: Radius.sm, padding: Spacing.md, color: Colors.textPrimary, fontSize: 15, marginBottom: Spacing.sm },
  submitBtn: { backgroundColor: Colors.gold, borderRadius: Radius.sm, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm },
  submitBtnText: { color: Colors.background, fontWeight: '800', letterSpacing: 2, fontSize: 13 },
  switchText: { color: Colors.gold, textAlign: 'center', marginTop: Spacing.lg, fontSize: 14 },
  avatarContainer: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.goldDim, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm, borderWidth: 2, borderColor: Colors.gold },
  avatarIcon: { fontSize: 36, color: Colors.gold },
  profileName: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 22, color: Colors.textPrimary },
  profileRole: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, letterSpacing: 1 },
  menuCard: { backgroundColor: Colors.backgroundCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.goldMuted, overflow: 'hidden', marginBottom: Spacing.lg },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.goldMuted },
  menuItemText: { fontSize: 15, color: Colors.textPrimary },
  chevron: { fontSize: 20, color: Colors.goldMuted },
  logoutBtn: { borderWidth: 1, borderColor: Colors.error, borderRadius: Radius.sm, padding: Spacing.md, alignItems: 'center' },
  logoutText: { color: Colors.error, fontWeight: '600', letterSpacing: 1 },
});
