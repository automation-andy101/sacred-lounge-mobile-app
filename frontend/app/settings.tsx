import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useAuth } from '../src/context/AuthContext';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const getToken = () => typeof window !== 'undefined'
  ? localStorage.getItem('accessToken')
  : null;

const authFetch = async (url: string, options: any = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
};

// ─── Section component ────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Field({ label, value, onChange, placeholder, secureTextEntry, keyboardType }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={S.textDisabled}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const saveProfile = async () => {
    setProfileLoading(true);
    setProfileMsg('');
    setProfileError('');
    try {
      await authFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, email }),
      });
      setProfileMsg('Profile updated successfully!');
    } catch (e: any) {
      setProfileError(e.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const changePassword = async () => {
    setPasswordMsg('');
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await authFetch('/profile/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPasswordError(e.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const deleteAccount = () => {
    const confirmed = typeof window !== 'undefined'
      ? window.confirm('Are you sure you want to delete your account? This cannot be undone.')
      : false;
    if (confirmed) {
      authFetch('/profile', { method: 'DELETE' })
        .then(() => logout())
        .catch(e => alert(e.message));
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/profile')}>
        <ArrowLeft size={20} color={S.gold} {...({} as any)} />
        <Text style={styles.backText}>Profile</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Settings</Text>

      {/* Profile Details */}
      <Section title="PROFILE DETAILS">
        <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="First name" />
        <Field label="Last Name" value={lastName} onChange={setLastName} placeholder="Last name" />
        <Field label="Email Address" value={email} onChange={setEmail} placeholder="Email" keyboardType="email-address" />

        {profileMsg ? <Text style={styles.successMsg}>{profileMsg}</Text> : null}
        {profileError ? <Text style={styles.errorMsg}>{profileError}</Text> : null}

        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile} disabled={profileLoading}>
          {profileLoading
            ? <ActivityIndicator color={S.bg} />
            : <><Save size={16} color={S.bg} {...({} as any)} /><Text style={styles.saveBtnText}>SAVE CHANGES</Text></>
          }
        </TouchableOpacity>
      </Section>

      {/* Change Password */}
      <Section title="CHANGE PASSWORD">
        <Field label="Current Password" value={currentPassword} onChange={setCurrentPassword} placeholder="Enter current password" secureTextEntry />
        <Field label="New Password" value={newPassword} onChange={setNewPassword} placeholder="At least 8 characters" secureTextEntry />
        <Field label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat new password" secureTextEntry />

        {passwordMsg ? <Text style={styles.successMsg}>{passwordMsg}</Text> : null}
        {passwordError ? <Text style={styles.errorMsg}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.saveBtn} onPress={changePassword} disabled={passwordLoading}>
          {passwordLoading
            ? <ActivityIndicator color={S.bg} />
            : <><Save size={16} color={S.bg} {...({} as any)} /><Text style={styles.saveBtnText}>CHANGE PASSWORD</Text></>
          }
        </TouchableOpacity>
      </Section>

      {/* Danger Zone */}
      <Section title="DANGER ZONE">
        <Text style={styles.dangerText}>
          Deleting your account is permanent and cannot be undone. All your bookings and data will be removed.
        </Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={deleteAccount}>
          <Text style={styles.deleteBtnText}>DELETE MY ACCOUNT</Text>
        </TouchableOpacity>
      </Section>

    </ScrollView>
  );
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
  success:     '#5E9E6A',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: S.bg },
  content: { padding: 20, paddingBottom: 60 },

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  backText: { fontSize: 14, color: S.gold },
  pageTitle: { fontSize: 26, color: S.gold, fontWeight: '300', letterSpacing: 1, marginBottom: 24 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 10, color: S.gold, letterSpacing: 3, fontWeight: '600', marginBottom: 10 },
  sectionCard: { backgroundColor: S.card, borderRadius: 12, borderWidth: 1, borderColor: S.goldDim, padding: 16 },

  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 11, color: S.textMuted, letterSpacing: 1, marginBottom: 6 },
  input: {
    backgroundColor: S.bg, borderWidth: 1, borderColor: S.goldDim,
    borderRadius: 8, padding: 12, color: S.text, fontSize: 14,
  },

  saveBtn: {
    flexDirection: 'row', backgroundColor: S.gold, borderRadius: 6,
    paddingVertical: 12, alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 8,
  },
  saveBtnText: { color: S.bg, fontWeight: '700', letterSpacing: 2, fontSize: 12 },

  successMsg: { fontSize: 13, color: S.success, marginTop: 8, textAlign: 'center' },
  errorMsg: { fontSize: 13, color: S.error, marginTop: 8, textAlign: 'center' },

  dangerText: { fontSize: 13, color: S.textMuted, lineHeight: 20, marginBottom: 16 },
  deleteBtn: {
    borderWidth: 1, borderColor: S.error, borderRadius: 6,
    paddingVertical: 12, alignItems: 'center',
  },
  deleteBtnText: { color: S.error, fontWeight: '600', letterSpacing: 2, fontSize: 12 },
});
