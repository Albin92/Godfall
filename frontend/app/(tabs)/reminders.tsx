// frontend/app/(tabs)/reminders.tsx
import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList,
  Modal, TextInput, Alert, ActivityIndicator, Platform, ScrollView
} from 'react-native';

const BACKEND_URL = 'http://192.168.137.249:5000'; // 🔁 Same as your index.tsx

// ─── Types ───────────────────────────────────────────────────
interface Reminder {
  _id: string;
  name: string;
  time: string;
  dosage: string;
  createdAt: string;
}

// ─── Main Component ──────────────────────────────────────────
export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch Reminders ─────────────────────────────────────────
  const fetchReminders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/reminders`);
      const json = await res.json();
      if (json.status === 'success') setReminders(json.data);
    } catch (err) {
      Alert.alert('Error', 'Could not load reminders. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // ── Add Reminder ─────────────────────────────────────────────
  const handleAdd = async () => {
  if (!medName.trim() || !medTime.trim() || !medDosage.trim()) {
    Alert.alert('Validation', 'Please fill in all fields.');
    return;
  }
  setSubmitting(true);
  try {
    const res = await fetch(`${BACKEND_URL}/api/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: medName, time: medTime, dosage: medDosage }),
    });

    // ✅ Show raw response text for debugging
    const text = await res.text();
    console.log('🔍 RAW RESPONSE:', text);

    const json = JSON.parse(text);

    if (json.status === 'success') {
      setReminders((prev) => [json.data, ...prev]);
      closeModal();
    } else {
      Alert.alert('Server Error', json.message); // ← shows real server message
    }
  } catch (err: any) {
    console.error('❌ Fetch Error:', err);
    Alert.alert('Error Detail', err.message); // ← shows real network error
  } finally {
    setSubmitting(false);
  }
};

  // ── Delete Reminder ──────────────────────────────────────────
  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Remove this medicine reminder?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await fetch(`${BACKEND_URL}/api/reminders/${id}`, { method: 'DELETE' });
            setReminders((prev) => prev.filter((r) => r._id !== id));
          } catch {
            Alert.alert('Error', 'Could not delete reminder.');
          }
        }
      }
    ]);
  };

  const closeModal = () => {
    setModalVisible(false);
    setMedName('');
    setMedTime('');
    setMedDosage('');
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  // ── Render Card ──────────────────────────────────────────────
  const renderItem = ({ item }: { item: Reminder }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.pillEmoji}>💊</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.medName}>{item.name}</Text>
        <Text style={styles.medDetail}>⏰ {item.time}</Text>
        <Text style={styles.medDetail}>💉 Dosage: {item.dosage}</Text>
        <Text style={styles.medDate}>📅 Added: {formatDate(item.createdAt)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Main Render ──────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💊 Medicine Reminders</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : reminders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🗒️</Text>
          <Text style={styles.emptyText}>No reminders yet.</Text>
          <Text style={styles.emptySubText}>Tap "+ Add" to create one.</Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ─── Add Medicine Modal ─────────────────────────────── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>➕ Add Medicine Reminder</Text>

            <Text style={styles.label}>Medicine Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Paracetamol"
              value={medName}
              onChangeText={setMedName}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 08:00 AM"
              value={medTime}
              onChangeText={setMedTime}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1 tablet / 500mg"
              value={medDosage}
              onChangeText={setMedDosage}
              placeholderTextColor="#aaa"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, submitting && { opacity: 0.6 }]}
                onPress={handleAdd}
                disabled={submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.saveText}>Save</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', paddingHorizontal: 16, paddingTop: 50 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1C1C1E' },
  addBtn: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  cardLeft: { marginRight: 12 },
  pillEmoji: { fontSize: 32 },
  cardContent: { flex: 1 },
  medName: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  medDetail: { fontSize: 14, color: '#555', marginBottom: 2 },
  medDate: { fontSize: 12, color: '#aaa', marginTop: 4 },
  deleteBtn: { padding: 6 },
  deleteText: { fontSize: 22 },

  // Empty state
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 60, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#333' },
  emptySubText: { fontSize: 14, color: '#888', marginTop: 4 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1C1C1E', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#F2F2F7', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1C1C1E', borderWidth: 1, borderColor: '#E0E0E5' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 28, gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#E5E5EA', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelText: { fontSize: 15, fontWeight: '700', color: '#333' },
  saveBtn: { flex: 1, backgroundColor: '#34C759', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
