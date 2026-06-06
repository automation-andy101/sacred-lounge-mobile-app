import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const getToken = () => typeof window !== 'undefined'
  ? localStorage.getItem('accessToken')
  : null;

const authFetch = async (url: string, options: any = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

// ─── Event Form ───────────────────────────────────────────────────────────────
function EventForm({ event, onClose }: { event?: any; onClose: () => void }) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        title: event?.title ?? '',
        shortDescription: event?.shortDescription ?? '',
        description: event?.description ?? '',
        eventDate: event?.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : '',
        endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
        locationName: event?.locationName ?? 'The Life Centre',
        locationAddress: event?.locationAddress ?? 'Deansgate, Manchester, M3 4LY',
        eventbriteUrl: event?.eventbriteUrl ?? '',
        isFree: event?.isFree ?? true,
        status: event?.status ?? 'PUBLISHED',
    });
  
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);


  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        ...form,
        eventDate: new Date(form.eventDate).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      };
      if (event?.id) {
        return authFetch(`/admin/events/${event.id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        return authFetch('/admin/events', { method: 'POST', body: JSON.stringify(body) });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      Alert.alert('Success', event?.id ? 'Event updated!' : 'Event created!');
      onClose();
    },
    onError: (e: any) => Alert.alert('Error', e.message),
  });

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  return (
    <ScrollView style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>{event?.id ? 'Edit Event' : 'New Event'}</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={22} color={S.gold} {...({} as any)} />
        </TouchableOpacity>
      </View>

      <Text style={styles.fieldLabel}>Title *</Text>
      <TextInput style={styles.input} value={form.title} onChangeText={v => set('title', v)} placeholderTextColor={S.textDisabled} placeholder="Event title" />

      <Text style={styles.fieldLabel}>Short Description</Text>
      <TextInput style={styles.input} value={form.shortDescription} onChangeText={v => set('shortDescription', v)} placeholderTextColor={S.textDisabled} placeholder="Brief description" multiline numberOfLines={2} />

      <Text style={styles.fieldLabel}>Full Description</Text>
      <TextInput style={[styles.input, styles.textArea]} value={form.description} onChangeText={v => set('description', v)} placeholderTextColor={S.textDisabled} placeholder="Full event description" multiline numberOfLines={4} />

      <Text style={styles.fieldLabel}>Start Date & Time *</Text>
        {Platform.OS === 'web' ? (
            <TextInput
                style={styles.input}
                value={form.eventDate}
                onChangeText={v => set('eventDate', v)}
                placeholderTextColor={S.textDisabled}
                placeholder="YYYY-MM-DDTHH:MM e.g. 2026-07-05T15:00"
            />
            ) : (
            <>
                <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
                <Text style={{ color: form.eventDate ? S.text : S.textDisabled }}>
                    {form.eventDate ? new Date(form.eventDate).toLocaleString('en-GB') : 'Select date and time'}
                </Text>
                </TouchableOpacity>
                {showStartPicker && (
                <DateTimePicker
                    value={form.eventDate ? new Date(form.eventDate) : new Date()}
                    mode="datetime"
                    onChange={(e, date) => { setShowStartPicker(false); if (date) set('eventDate', date.toISOString()); }}
                />
                )}
            </>
        )}

        <Text style={styles.fieldLabel}>End Date & Time</Text>
            {Platform.OS === 'web' ? (
                <TextInput
                    style={styles.input}
                    value={form.endDate}
                    onChangeText={v => set('endDate', v)}
                    placeholderTextColor={S.textDisabled}
                    placeholder="YYYY-MM-DDTHH:MM e.g. 2026-07-05T17:00"
                />
                ) : (
                <>
                    <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
                    <Text style={{ color: form.endDate ? S.text : S.textDisabled }}>
                        {form.endDate ? new Date(form.endDate).toLocaleString('en-GB') : 'Select date and time'}
                    </Text>
                    </TouchableOpacity>
                    {showEndPicker && (
                    <DateTimePicker
                        value={form.endDate ? new Date(form.endDate) : new Date()}
                        mode="datetime"
                        onChange={(e, date) => { setShowEndPicker(false); if (date) set('endDate', date.toISOString()); }}
                    />
                    )}
                </>
            )}

      <Text style={styles.fieldLabel}>Location Name</Text>
      <TextInput style={styles.input} value={form.locationName} onChangeText={v => set('locationName', v)} placeholderTextColor={S.textDisabled} />

      <Text style={styles.fieldLabel}>Location Address</Text>
      <TextInput style={styles.input} value={form.locationAddress} onChangeText={v => set('locationAddress', v)} placeholderTextColor={S.textDisabled} />

      <Text style={styles.fieldLabel}>Eventbrite URL</Text>
      <TextInput style={styles.input} value={form.eventbriteUrl} onChangeText={v => set('eventbriteUrl', v)} placeholderTextColor={S.textDisabled} placeholder="https://eventbrite.com/e/..." autoCapitalize="none" />

      <View style={styles.switchRow}>
        <Text style={styles.fieldLabel}>Free Entry</Text>
        <Switch value={form.isFree} onValueChange={v => set('isFree', v)} trackColor={{ true: S.gold }} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.fieldLabel}>Published</Text>
        <Switch value={form.status === 'PUBLISHED'} onValueChange={v => set('status', v ? 'PUBLISHED' : 'DRAFT')} trackColor={{ true: S.gold }} />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        {saveMutation.isPending
          ? <ActivityIndicator color={S.bg} />
          : <>
              <Save size={16} color={S.bg} {...({} as any)} />
              <Text style={styles.saveBtnText}>SAVE EVENT</Text>
            </>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Main Admin Screen ────────────────────────────────────────────────────────
export default function AdminScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => authFetch('/admin/events'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authFetch(`/admin/events/${id}`, { method: 'DELETE' })
      .catch(() => fetch(`${API_BASE}/admin/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const confirmDelete = (id: string, title: string) => {
    Alert.alert('Delete Event', `Are you sure you want to delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  if (showNewEvent || editingEvent) {
    return <EventForm event={editingEvent} onClose={() => { setEditingEvent(null); setShowNewEvent(false); }} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/profile')}>
          <ArrowLeft size={20} color={S.gold} {...({} as any)} />
          <Text style={styles.backText}>Profile</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowNewEvent(true)}>
          <Plus size={20} color={S.bg} {...({} as any)} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>EVENTS</Text>

      {isLoading ? (
        <ActivityIndicator color={S.gold} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {(events?.content ?? events ?? []).map((event: any) => (
            <View key={event.id} style={styles.eventRow}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                <Text style={styles.eventMeta}>
                  {new Date(event.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
                <View style={[styles.statusBadge, event.status === 'PUBLISHED' && styles.statusPublished]}>
                  <Text style={styles.statusText}>{event.status}</Text>
                </View>
              </View>
              <View style={styles.eventActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setEditingEvent(event)}>
                  <Edit size={16} color={S.gold} {...({} as any)} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDelete(event.id, event.title)}>
                  <Trash2 size={16} color={S.error} {...({} as any)} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: S.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 14, color: S.gold },
  headerTitle: { fontSize: 16, color: S.gold, letterSpacing: 2, fontWeight: '300' },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: S.gold, alignItems: 'center', justifyContent: 'center',
  },

  sectionLabel: {
    fontSize: 10, color: S.gold, letterSpacing: 3,
    fontWeight: '600', padding: 16, paddingBottom: 8,
  },

  list: { padding: 16, paddingBottom: 40 },

  eventRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: S.card, borderRadius: 10,
    borderWidth: 1, borderColor: S.goldDim,
    padding: 14, marginBottom: 10, gap: 12,
  },
  eventInfo: { flex: 1, gap: 4 },
  eventTitle: { fontSize: 15, color: S.text },
  eventMeta: { fontSize: 12, color: S.textMuted },
  statusBadge: {
    alignSelf: 'flex-start', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: S.goldDim, marginTop: 4,
  },
  statusPublished: { borderColor: S.success },
  statusText: { fontSize: 10, color: S.success, letterSpacing: 1 },
  eventActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 34, height: 34, borderRadius: 6,
    backgroundColor: S.goldDim, alignItems: 'center', justifyContent: 'center',
  },

  // Form
  formContainer: { flex: 1, backgroundColor: S.bg, padding: 20 },
  formHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  formTitle: { fontSize: 18, color: S.gold, fontWeight: '300', letterSpacing: 1 },
  fieldLabel: { fontSize: 11, color: S.gold, letterSpacing: 2, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: S.card, borderWidth: 1, borderColor: S.goldDim,
    borderRadius: 8, padding: 12, color: S.text, fontSize: 14,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 12,
  },
  saveBtn: {
    flexDirection: 'row', backgroundColor: S.gold, borderRadius: 6,
    paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 24, marginBottom: 40,
  },
  saveBtnText: { color: S.bg, fontWeight: '700', letterSpacing: 3, fontSize: 12 },
});
