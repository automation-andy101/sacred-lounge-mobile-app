import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const faqs = [
  {
    q: 'What should I bring to a Sacred Lounge event?',
    a: 'Just yourself and an open mind! We provide all equipment including yoga mats, cushions and blankets. Wear comfortable clothing you can relax in.',
  },
  {
    q: 'Are the events suitable for beginners?',
    a: 'Absolutely. All our events are welcoming to complete beginners. No experience with meditation or yoga is necessary — just a willingness to explore.',
  },
  {
    q: 'Where are events held?',
    a: 'Most events are held at The Life Centre, Deansgate, Manchester. The full address is always shown on the event details page.',
  },
  {
    q: 'How do I cancel my booking?',
    a: 'You can manage your Eventbrite booking directly through the Eventbrite app or website. For any issues please contact us directly.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'An account lets you track your bookings and access the full meditation library. You can browse events without an account.',
  },
  {
    q: 'Is the meditation library free?',
    a: 'Yes — all meditations, talks and kirtan in the library are free to access for all members.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={styles.faqItem} onPress={() => setOpen(!open)} activeOpacity={0.8}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{q}</Text>
        <Text style={styles.faqChevron}>{open ? '−' : '+'}</Text>
      </View>
      {open && <Text style={styles.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    if (!name || !email || !message) {
      setError('Please fill in all fields');
      return;
    }
    setSending(true);
    setError('');
    try {
      // For now open mailto as fallback
      const subject = encodeURIComponent(`Sacred Lounge App — Message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      await Linking.openURL(`mailto:manchestersacredlounge@gmail.com?subject=${subject}&body=${body}`);
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (e) {
      setError('Could not open mail app. Please email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/profile')}>
        <ArrowLeft size={20} color={S.gold} {...({} as any)} />
        <Text style={styles.backText}>Profile</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Help & Support</Text>
      <Text style={styles.pageSubtitle}>We're here to help. Reach out anytime.</Text>

      {/* Contact Details */}
      <View style={styles.sectionCard}>
        <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:manchestersacredlounge@gmail.com')}>
          <Mail size={18} color={S.gold} {...({} as any)} />
          <Text style={styles.contactText}>manchestersacredlounge@gmail.com</Text>
        </TouchableOpacity>
        <View style={styles.contactDivider} />
        <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:+447588525022')}>
          <Phone size={18} color={S.gold} {...({} as any)} />
          <Text style={styles.contactText}>+44 7588 525022</Text>
        </TouchableOpacity>
        <View style={styles.contactDivider} />
        <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('https://maps.google.com/?q=293A+Deansgate+Manchester')}>
          <MapPin size={18} color={S.gold} {...({} as any)} />
          <Text style={styles.contactText}>293A Deansgate, Manchester</Text>
        </TouchableOpacity>
      </View>

      {/* Social Links */}
      <Text style={styles.sectionLabel}>FIND US ONLINE</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.instagram.com/sacredlounge.manchester/')}>
          <Instagram size={22} color={S.gold} {...({} as any)} />
          <Text style={styles.socialLabel}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.facebook.com/p/Manchester-Sacred-Lounge-61586090814323/')}>
          <Facebook size={22} color={S.gold} {...({} as any)} />
          <Text style={styles.socialLabel}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.meetup.com/sacred-lounge-meetup-group/')}>
          <Text style={styles.meetupIcon}>M</Text>
          <Text style={styles.socialLabel}>Meetup</Text>
        </TouchableOpacity>
      </View>

      {/* FAQ */}
      <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
      <View style={styles.faqContainer}>
        {faqs.map((faq, i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} />
        ))}
      </View>

      {/* Contact Form */}
      <Text style={styles.sectionLabel}>SEND US A MESSAGE</Text>
      <View style={styles.sectionCard}>
        {sent ? (
          <View style={styles.sentContainer}>
            <Text style={styles.sentIcon}>✦</Text>
            <Text style={styles.sentTitle}>Message Sent!</Text>
            <Text style={styles.sentText}>We'll get back to you as soon as possible.</Text>
            <TouchableOpacity onPress={() => setSent(false)}>
              <Text style={styles.sentReset}>Send another message</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Your Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={S.textDisabled} placeholder="Full name" />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor={S.textDisabled} placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Message</Text>
              <TextInput style={[styles.input, styles.textArea]} value={message} onChangeText={setMessage} placeholderTextColor={S.textDisabled} placeholder="How can we help?" multiline numberOfLines={4} />
            </View>

            {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={sending}>
              {sending
                ? <ActivityIndicator color={S.bg} />
                : <><Send size={16} color={S.bg} {...({} as any)} /><Text style={styles.sendBtnText}>SEND MESSAGE</Text></>
              }
            </TouchableOpacity>
          </>
        )}
      </View>

    </ScrollView>
  );
}

const S = {
  bg: '#070302', card: '#1A0F08', gold: '#BD8950', goldDim: '#4A3220',
  text: '#E8DDCF', textMuted: '#9C7D5E', textDisabled: '#4A3220',
  border: '#2A1A0E', error: '#C0514A', success: '#5E9E6A',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: S.bg },
  content: { padding: 20, paddingBottom: 60 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  backText: { fontSize: 14, color: S.gold },
  pageTitle: { fontSize: 26, color: S.gold, fontWeight: '300', letterSpacing: 1, marginBottom: 6 },
  pageSubtitle: { fontSize: 14, color: S.textMuted, fontStyle: 'italic', marginBottom: 24 },

  sectionLabel: { fontSize: 10, color: S.gold, letterSpacing: 3, fontWeight: '600', marginBottom: 12, marginTop: 24 },
  sectionCard: { backgroundColor: S.card, borderRadius: 12, borderWidth: 1, borderColor: S.goldDim, padding: 16 },

  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  contactText: { fontSize: 14, color: S.text, flex: 1 },
  contactDivider: { height: 1, backgroundColor: S.goldDim, marginVertical: 10 },

  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, backgroundColor: S.card, borderRadius: 10, borderWidth: 1, borderColor: S.goldDim, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  socialLabel: { fontSize: 11, color: S.textMuted, letterSpacing: 1 },
  meetupIcon: { fontSize: 22, color: S.gold, fontWeight: '700' },

  faqContainer: { borderRadius: 12, borderWidth: 1, borderColor: S.goldDim, overflow: 'hidden' },
  faqItem: { backgroundColor: S.card, padding: 16, borderBottomWidth: 1, borderBottomColor: S.goldDim },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  faqQ: { fontSize: 14, color: S.text, flex: 1, lineHeight: 20 },
  faqChevron: { fontSize: 20, color: S.gold, lineHeight: 22 },
  faqA: { fontSize: 13, color: S.textMuted, lineHeight: 20, marginTop: 10 },

  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 11, color: S.textMuted, letterSpacing: 1, marginBottom: 6 },
  input: { backgroundColor: S.bg, borderWidth: 1, borderColor: S.goldDim, borderRadius: 8, padding: 12, color: S.text, fontSize: 14 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  errorMsg: { fontSize: 13, color: S.error, marginBottom: 8, textAlign: 'center' },

  sendBtn: { flexDirection: 'row', backgroundColor: S.gold, borderRadius: 6, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 },
  sendBtnText: { color: S.bg, fontWeight: '700', letterSpacing: 2, fontSize: 12 },

  sentContainer: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  sentIcon: { fontSize: 28, color: S.gold },
  sentTitle: { fontSize: 18, color: S.text, fontWeight: '300' },
  sentText: { fontSize: 13, color: S.textMuted, textAlign: 'center' },
  sentReset: { fontSize: 13, color: S.gold, marginTop: 8 },
});
