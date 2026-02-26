import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const BACKEND_URL = "http://192.168.137.249:5000";

interface Reminder {
  _id: string;
  name: string;
  time: string;
  dosage: string;
  frequency: string;
}

export default function HomeScreen() {
  const [now, setNow] = useState(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [taken, setTaken] = useState<Set<string>>(new Set());

  // ── Live Clock ───────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Fetch Medicines from Backend ─────────────────────────────
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/reminders`);
      const json = await res.json();
      if (json.status === 'success') setReminders(json.data);
    } catch (err) {
      Alert.alert('Error', 'Could not load medicines.');
    } finally {
      setLoading(false);
    }
  };

  const handleTake = (id: string, name: string) => {
    setTaken((prev) => new Set([...prev, id]));
    Alert.alert('✅ Done!', `${name} marked as taken.`);
  };

  // ── Formatting Helpers ───────────────────────────────────────
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'});

  const remaining = reminders.filter((r) => !taken.has(r._id)).length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="menu" size={24} color="#333" />
          <Text style={styles.logo}>MediCare+</Text>
          <Ionicons name="person-circle-outline" size={28} color="#2F6FD6" />
        </View>

        {/* Live Date & Time Card */}
        <View style={styles.dateCard}>
          <Text style={styles.today}>TODAY IS</Text>
          <Text style={styles.date}>{formatDate(now)}</Text>
          <Text style={styles.time}>{formatTime(now)}</Text>
        </View>

        {/* Health Vitals */}
        <Text style={styles.sectionTitle}>Health Vitals</Text>

        {/* Heart Rate */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalLeftGreen} />
          <View style={styles.vitalContent}>
            <View style={styles.iconCircleGreen}>
              <Ionicons name="heart" size={18} color="#1DB954" />
            </View>
            <View>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <Text style={styles.vitalValue}>72 <Text style={styles.unit}>BPM</Text></Text>
            </View>
            <View style={styles.badgeGreen}>
              <Text style={styles.badgeText}>NORMAL</Text>
            </View>
          </View>
        </View>

        {/* Blood Pressure */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalLeftYellow} />
          <View style={styles.vitalContent}>
            <View style={styles.iconCircleYellow}>
              <MaterialCommunityIcons name="heart-pulse" size={18} color="#F4A100" />
            </View>
            <View>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>135/85 <Text style={styles.unit}>mmHg</Text></Text>
            </View>
            <View style={styles.badgeYellow}>
              <Text style={styles.badgeTextYellow}>SLIGHTLY HIGH</Text>
            </View>
          </View>
        </View>

        {/* Today's Medicines */}
        <View style={styles.medsHeader}>
          <Text style={styles.sectionTitle}>Today's Medicines</Text>
          <View style={styles.remainingBadge}>
            <Text style={styles.remainingText}>{remaining} Remaining</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2F6FD6" style={{ marginTop: 20 }} />
        ) : reminders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>💊</Text>
            <Text style={styles.emptyText}>No medicines added yet.</Text>
          </View>
        ) : (
          reminders.map((item) => {
            const isTaken = taken.has(item._id);
            return (
              <View key={item._id} style={[styles.medicineCard, isTaken && styles.medicineCardTaken]}>
                <View style={isTaken ? styles.medIconGrey : styles.medIcon}>
                  <Ionicons
                    name={isTaken ? "checkmark-circle-outline" : "medical"}
                    size={22}
                    color={isTaken ? "#777" : "#2F6FD6"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.medName, isTaken && styles.medNameTaken]}>{item.name}</Text>
                  <Text style={styles.medSub}>⏰ {item.time}  •  {item.dosage}</Text>
                  {item.frequency ? (
                    <Text style={styles.medFreq}>🔁 {item.frequency}</Text>
                  ) : null}
                </View>
                {isTaken ? (
                  <View style={styles.doneButton}>
                    <Text style={styles.doneText}>DONE</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.takeButton}
                    onPress={() => handleTake(item._id, item.name)}
                  >
                    <Text style={styles.takeText}>TAKE</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", padding: 20,
  },
  logo: { fontSize: 18, fontWeight: "600" },
  dateCard: {
    backgroundColor: "#fff", marginHorizontal: 20,
    borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 20,
  },
  today: { color: "#2F6FD6", fontWeight: "600", letterSpacing: 1 },
  date: { fontSize: 18, fontWeight: "600", marginVertical: 4 },
  time: { fontSize: 28, fontWeight: "700", color: "#2F6FD6" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginHorizontal: 20, marginBottom: 12 },
  vitalCard: {
    backgroundColor: "#fff", marginHorizontal: 20,
    borderRadius: 16, marginBottom: 15, overflow: "hidden",
  },
  vitalLeftGreen: { position: "absolute", left: 0, top: 0, bottom: 0, width: 6, backgroundColor: "#1DB954" },
  vitalLeftYellow: { position: "absolute", left: 0, top: 0, bottom: 0, width: 6, backgroundColor: "#F4A100" },
  vitalContent: { flexDirection: "row", alignItems: "center", padding: 16, justifyContent: "space-between" },
  iconCircleGreen: { backgroundColor: "#E6F6EC", padding: 10, borderRadius: 50, marginRight: 10 },
  iconCircleYellow: { backgroundColor: "#FFF3E0", padding: 10, borderRadius: 50, marginRight: 10 },
  vitalLabel: { fontSize: 14, color: "#666" },
  vitalValue: { fontSize: 20, fontWeight: "700" },
  unit: { fontSize: 14, fontWeight: "400", color: "#999" },
  badgeGreen: { backgroundColor: "#E6F6EC", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeYellow: { backgroundColor: "#FFF3E0", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: "#1DB954", fontSize: 12, fontWeight: "600" },
  badgeTextYellow: { color: "#F4A100", fontSize: 12, fontWeight: "600" },
  medsHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginHorizontal: 20, marginBottom: 12,
  },
  remainingBadge: { backgroundColor: "#E6F0FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  remainingText: { color: "#2F6FD6", fontSize: 12, fontWeight: "600" },
  medicineCard: {
    backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16,
    padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  medicineCardTaken: { opacity: 0.55 },
  medIcon: { backgroundColor: "#E6F0FF", padding: 12, borderRadius: 16, marginRight: 12 },
  medIconGrey: { backgroundColor: "#F0F0F0", padding: 12, borderRadius: 16, marginRight: 12 },
  medName: { fontSize: 16, fontWeight: "600" },
  medNameTaken: { textDecorationLine: "line-through", color: "#999" },
  medSub: { fontSize: 12, color: "#666", marginTop: 2 },
  medFreq: { fontSize: 11, color: "#aaa", marginTop: 2 },
  takeButton: { backgroundColor: "#2F6FD6", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  takeText: { color: "#fff", fontWeight: "600" },
  doneButton: { backgroundColor: "#E6F6EC", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  doneText: { color: "#1DB954", fontWeight: "600" },
  emptyCard: { alignItems: "center", marginTop: 20, paddingVertical: 30 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { color: "#aaa", fontSize: 14 },
});