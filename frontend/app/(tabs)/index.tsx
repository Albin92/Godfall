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

interface VitalsData {
  heartRate: string | null;
  hrStatus: string;
  systolic: string | null;
  diastolic: string | null;
  bpStatus: string;
}

// ── Status helpers ─────────────────────────────────────────────
const getBPLabel = (sys: string, dia: string) => {
  const s = parseInt(sys), d = parseInt(dia);
  if (isNaN(s) || isNaN(d)) return "—";
  if (s < 120 && d < 80)    return "NORMAL";
  if (s <= 129 && d < 80)   return "ELEVATED";
  if (s <= 139 || d <= 89)  return "SLIGHTLY HIGH";
  return "HIGH";
};

const getHRLabel = (hr: string) => {
  const n = parseInt(hr);
  if (isNaN(n))            return "—";
  if (n >= 60 && n <= 100) return "NORMAL";
  if (n < 60)              return "LOW";
  return "HIGH";
};

export default function HomeScreen() {
  const [now, setNow]           = useState(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading]   = useState(true);
  const [taken, setTaken]       = useState<Set<string>>(new Set());
  const [vitals, setVitals]     = useState<VitalsData>({
    heartRate: null, hrStatus: "—",
    systolic: null, diastolic: null, bpStatus: "—",
  });

  // ── Live Clock ────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Fetch on mount ────────────────────────────────────────────
  useEffect(() => {
    fetchReminders();
    fetchVitals();
  }, []);

  // ── Refetch vitals every 30 seconds ──────────────────────────
  useEffect(() => {
    const interval = setInterval(fetchVitals, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/reminders`);
      const json = await res.json();
      if (json.status === 'success') setReminders(json.data);
    } catch {
      Alert.alert('Error', 'Could not load medicines.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVitals = async () => {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/vitals/latest`);
      const json = await res.json();
      if (json.status === 'success') {
        const d = json.data;
        const hr  = d['Heart Rate']?.heartRate   || null;
        const sys = d['Blood Pressure']?.systolic  || null;
        const dia = d['Blood Pressure']?.diastolic || null;
        setVitals({
          heartRate: hr,
          hrStatus:  hr  ? getHRLabel(hr)       : "—",
          systolic:  sys,
          diastolic: dia,
          bpStatus:  sys && dia ? getBPLabel(sys, dia) : "—",
        });
      }
    } catch {
      // silently fail — vitals will show defaults
    }
  };

  const handleTake = (id: string, name: string) => {
    setTaken((prev) => new Set([...prev, id]));
    Alert.alert('✅ Done!', `${name} marked as taken.`);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const remaining = reminders.filter((r) => !taken.has(r._id)).length;

  // ── BP badge color based on status ──────────────────────────
  const bpIsHigh = vitals.bpStatus === "HIGH" || vitals.bpStatus === "SLIGHTLY HIGH" || vitals.bpStatus === "ELEVATED";
  const hrIsNormal = vitals.hrStatus === "NORMAL";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="menu" size={24} color="#333" />
          <Text style={styles.logo}>MediCare+</Text>
          <Ionicons name="person-circle-outline" size={28} color="#2F6FD6" />
        </View>

        {/* Live Date & Time */}
        <View style={styles.dateCard}>
          <Text style={styles.today}>TODAY IS</Text>
          <Text style={styles.date}>{formatDate(now)}</Text>
          <Text style={styles.time}>{formatTime(now)}</Text>
        </View>

        {/* Health Vitals */}
        <Text style={styles.sectionTitle}>Health Vitals</Text>

        {/* Heart Rate — live from DB */}
        <View style={styles.vitalCard}>
          <View style={[styles.vitalAccent, { backgroundColor: hrIsNormal ? "#1DB954" : "#F4A100" }]} />
          <View style={styles.vitalContent}>
            <View style={[styles.iconCircle, { backgroundColor: "#E6F6EC" }]}>
              <Ionicons name="heart" size={18} color="#1DB954" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <Text style={styles.vitalValue}>
                {vitals.heartRate ?? "—"}{" "}
                <Text style={styles.unit}>{vitals.heartRate ? "BPM" : ""}</Text>
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: hrIsNormal ? "#E6F6EC" : "#FFF3E0" }]}>
              <Text style={[styles.badgeText, { color: hrIsNormal ? "#1DB954" : "#F4A100" }]}>
                {vitals.hrStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Blood Pressure — live from DB */}
        <View style={styles.vitalCard}>
          <View style={[styles.vitalAccent, { backgroundColor: bpIsHigh ? "#F4A100" : "#1DB954" }]} />
          <View style={styles.vitalContent}>
            <View style={[styles.iconCircle, { backgroundColor: "#FFF3E0" }]}>
              <MaterialCommunityIcons name="heart-pulse" size={18} color="#F4A100" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>
                {vitals.systolic && vitals.diastolic
                  ? `${vitals.systolic}/${vitals.diastolic}`
                  : "—"}{" "}
                <Text style={styles.unit}>
                  {vitals.systolic ? "mmHg" : ""}
                </Text>
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: bpIsHigh ? "#FFF3E0" : "#E6F6EC" }]}>
              <Text style={[styles.badgeText, { color: bpIsHigh ? "#F4A100" : "#1DB954" }]}>
                {vitals.bpStatus}
              </Text>
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
                  {item.frequency ? <Text style={styles.medFreq}>🔁 {item.frequency}</Text> : null}
                </View>
                {isTaken ? (
                  <View style={styles.doneButton}>
                    <Text style={styles.doneText}>DONE</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.takeButton} onPress={() => handleTake(item._id, item.name)}>
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
  container:  { flex: 1, backgroundColor: "#F5F7FA" },
  header:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  logo:       { fontSize: 18, fontWeight: "600" },
  dateCard:   { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 20 },
  today:      { color: "#2F6FD6", fontWeight: "600", letterSpacing: 1 },
  date:       { fontSize: 18, fontWeight: "600", marginVertical: 4 },
  time:       { fontSize: 28, fontWeight: "700", color: "#2F6FD6" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginHorizontal: 20, marginBottom: 12 },
  vitalCard:  { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, marginBottom: 15, overflow: "hidden" },
  vitalAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 6 },
  vitalContent: { flexDirection: "row", alignItems: "center", padding: 16 },
  iconCircle: { padding: 10, borderRadius: 50, marginRight: 12 },
  vitalLabel: { fontSize: 13, color: "#666" },
  vitalValue: { fontSize: 20, fontWeight: "700" },
  unit:       { fontSize: 13, fontWeight: "400", color: "#999" },
  badge:      { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText:  { fontSize: 11, fontWeight: "600" },
  medsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, marginBottom: 12 },
  remainingBadge: { backgroundColor: "#E6F0FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  remainingText:  { color: "#2F6FD6", fontSize: 12, fontWeight: "600" },
  medicineCard:   { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  medicineCardTaken: { opacity: 0.55 },
  medIcon:     { backgroundColor: "#E6F0FF", padding: 12, borderRadius: 16, marginRight: 12 },
  medIconGrey: { backgroundColor: "#F0F0F0", padding: 12, borderRadius: 16, marginRight: 12 },
  medName:     { fontSize: 16, fontWeight: "600" },
  medNameTaken: { textDecorationLine: "line-through", color: "#999" },
  medSub:      { fontSize: 12, color: "#666", marginTop: 2 },
  medFreq:     { fontSize: 11, color: "#aaa", marginTop: 2 },
  takeButton:  { backgroundColor: "#2F6FD6", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  takeText:    { color: "#fff", fontWeight: "600" },
  doneButton:  { backgroundColor: "#E6F6EC", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  doneText:    { color: "#1DB954", fontWeight: "600" },
  emptyCard:   { alignItems: "center", marginTop: 20, paddingVertical: 30 },
  emptyEmoji:  { fontSize: 40, marginBottom: 8 },
  emptyText:   { color: "#aaa", fontSize: 14 },
});