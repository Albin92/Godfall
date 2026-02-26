import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import * as Speech from 'expo-speech';

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

const getBPLabel = (sys: string, dia: string) => {
  const s = parseInt(sys), d = parseInt(dia);
  if (isNaN(s) || isNaN(d)) return "—";
  if (s < 120 && d < 80)   return "NORMAL";
  if (s <= 129 && d < 80)  return "ELEVATED";
  if (s <= 139 || d <= 89) return "SLIGHTLY HIGH";
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
  const [now, setNow]               = useState(new Date());
  const [reminders, setReminders]   = useState<Reminder[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [taken, setTaken]           = useState<Set<string>>(new Set());
  const [vitals, setVitals]         = useState<VitalsData>({
    heartRate: null, hrStatus: "—",
    systolic: null, diastolic: null, bpStatus: "—",
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Refs so speakWelcome always reads freshest data
  const remindersRef = useRef<Reminder[]>([]);
  const vitalsRef    = useRef<VitalsData>(vitals);
  const nowRef       = useRef<Date>(new Date());
  remindersRef.current = reminders;
  vitalsRef.current    = vitals;
  nowRef.current       = now;

  // ── Live Clock ────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Load data on mount, then speak ───────────────────────────
  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchReminders(), fetchVitals()]);
      setTimeout(speakWelcome, 900);
    };
    init();
    return () => { Speech.stop(); };
  }, []);

  // ── Refresh vitals every 30s ──────────────────────────────────
  useEffect(() => {
    const iv = setInterval(fetchVitals, 30000);
    return () => clearInterval(iv);
  }, []);

  const fetchReminders = async () => {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/reminders`);
      const json = await res.json();
      if (json.status === 'success') setReminders(json.data);
    } catch {
      Alert.alert('Error', 'Could not load medicines.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchVitals = async () => {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/vitals/latest`);
      const json = await res.json();
      if (json.status === 'success') {
        const d   = json.data;
        const hr  = d['Heart Rate']?.heartRate     || null;
        const sys = d['Blood Pressure']?.systolic  || null;
        const dia = d['Blood Pressure']?.diastolic || null;
        setVitals({
          heartRate: hr,
          hrStatus:  hr         ? getHRLabel(hr)       : "—",
          systolic:  sys,
          diastolic: dia,
          bpStatus:  sys && dia ? getBPLabel(sys, dia) : "—",
        });
      }
    } catch { /* silently fail */ }
  };

  const handleDelete = async (id: string) => {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/reminders/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status === 'success') {
        setReminders(prev => prev.filter(item => item._id !== id));
        speakText('Medicine removed.');
      }
    } catch {
      Alert.alert("Error", "Could not delete medicine.");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReminders();
    fetchVitals();
  }, []);

  // ── TalkBack helpers ──────────────────────────────────────────
  const speakText = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'en-US', rate: 0.85 });
  };

  const speakWelcome = () => {
    Speech.stop();
    const date = nowRef.current;
    const v    = vitalsRef.current;
    const meds = remindersRef.current;

    const dayName  = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const timeStr  = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let script = `Good day! Today is ${dayName}, ${monthDay}. The current time is ${timeStr}. `;

    script += v.heartRate
      ? `Your heart rate is ${v.heartRate} beats per minute. Status: ${v.hrStatus}. `
      : `No heart rate reading recorded yet. `;

    script += (v.systolic && v.diastolic)
      ? `Your blood pressure is ${v.systolic} over ${v.diastolic} millimeters of mercury. Status: ${v.bpStatus}. `
      : `No blood pressure reading recorded yet. `;

    if (meds.length === 0) {
      script += `You have no medicines scheduled for today. `;
    } else {
      script += `You have ${meds.length} medicine${meds.length > 1 ? 's' : ''} scheduled today. `;
      meds.forEach((med, i) => {
        const parts = med.dosage.split('/').map((p: string) => p.trim());
        const pill  = parts[0] || med.dosage;
        const mg    = parts[1] || '';
        script += `Medicine ${i + 1}: ${med.name}. `;
        script += `Take it at ${med.time}. `;
        script += `Dosage: ${pill}${mg ? ', ' + mg : ''}. `;
        if (med.frequency) script += `Taken ${med.frequency}. `;
      });
      script += `Please take your medicines on time. `;
    }
    script += `Stay healthy and have a wonderful day!`;

    setIsSpeaking(true);
    Speech.speak(script, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.85,
      onDone:  () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeech = () => { Speech.stop(); setIsSpeaking(false); };

  const handleTake = (id: string, name: string) => {
    setTaken((prev) => new Set([...prev, id]));
    speakText(`${name} marked as taken. Well done!`);
    Alert.alert('✅ Done!', `${name} marked as taken.`);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const remaining  = reminders.filter((r) => !taken.has(r._id)).length;
  const bpIsHigh   = ["HIGH", "SLIGHTLY HIGH", "ELEVATED"].includes(vitals.bpStatus);
  const hrIsNormal = vitals.hrStatus === "NORMAL";

  const renderRightActions = (id: string) => (
    <TouchableOpacity style={styles.deleteAction} onPress={() => handleDelete(id)}>
      <Ionicons name="trash" size={24} color="white" />
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2F6FD6"]} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="menu" size={24} color="#333" />
            <Text style={styles.logo}>MediCare+</Text>
            <Ionicons name="person-circle-outline" size={28} color="#2F6FD6" />
          </View>

          {/* ── TalkBack Control Bar ─────────────────────────── */}
          <View style={styles.talkbackBar}>
            <View style={styles.talkbackLeft}>
              <Ionicons name="volume-high-outline" size={22} color="#2F6FD6" />
              <Text style={styles.talkbackLabel}>
                {isSpeaking ? "🔊 Speaking..." : "TalkBack"}
              </Text>
            </View>
            <View style={styles.talkbackBtns}>
              <TouchableOpacity style={styles.readBtn} onPress={speakWelcome}>
                <Ionicons name="play-circle" size={16} color="#fff" />
                <Text style={styles.readBtnText}>Read All</Text>
              </TouchableOpacity>
              {isSpeaking && (
                <TouchableOpacity style={styles.stopBtn} onPress={stopSpeech}>
                  <Ionicons name="stop-circle" size={16} color="#fff" />
                  <Text style={styles.stopBtnText}>Stop</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Live Date & Time (tappable) ─────────────────── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => speakText(`Today is ${formatDate(now)}. The time is ${formatTime(now)}.`)}
          >
            <View style={styles.dateCard}>
              <Text style={styles.today}>TODAY IS</Text>
              <Text style={styles.date}>{formatDate(now)}</Text>
              <Text style={styles.time}>{formatTime(now)}</Text>
              <Text style={styles.tapHint}>🔊 Tap to hear</Text>
            </View>
          </TouchableOpacity>

          {/* ── Health Vitals ────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Health Vitals</Text>

          {/* Heart Rate */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => speakText(
              vitals.heartRate
                ? `Your heart rate is ${vitals.heartRate} beats per minute. Status: ${vitals.hrStatus}.`
                : `No heart rate reading recorded yet.`
            )}
          >
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
              <Text style={styles.cardTapHint}>🔊 Tap to hear</Text>
            </View>
          </TouchableOpacity>

          {/* Blood Pressure */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => speakText(
              vitals.systolic && vitals.diastolic
                ? `Your blood pressure is ${vitals.systolic} over ${vitals.diastolic}. Status: ${vitals.bpStatus}.`
                : `No blood pressure reading recorded yet.`
            )}
          >
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
                      ? `${vitals.systolic}/${vitals.diastolic}` : "—"}{" "}
                    <Text style={styles.unit}>{vitals.systolic ? "mmHg" : ""}</Text>
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: bpIsHigh ? "#FFF3E0" : "#E6F6EC" }]}>
                  <Text style={[styles.badgeText, { color: bpIsHigh ? "#F4A100" : "#1DB954" }]}>
                    {vitals.bpStatus}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardTapHint}>🔊 Tap to hear</Text>
            </View>
          </TouchableOpacity>

          {/* ── Today's Medicines ────────────────────────────── */}
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
              const parts   = item.dosage.split('/').map((p: string) => p.trim());
              const pill    = parts[0] || item.dosage;
              const mg      = parts[1] || '';
              const status  = isTaken ? 'already taken' : 'not yet taken';

              return (
                <Swipeable key={item._id} renderRightActions={() => renderRightActions(item._id)}>
                  {/* Tap card to hear details */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => speakText(
                      `${item.name}. Take at ${item.time}. Dosage: ${pill}${mg ? ', ' + mg : ''}. ` +
                      `${item.frequency ? 'Taken ' + item.frequency + '. ' : ''}` +
                      `Status: ${status}.`
                    )}
                  >
                    <View style={[styles.medicineCard, isTaken && styles.medicineCardTaken]}>
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
                        <Text style={styles.medTapHint}>🔊 Tap to hear • Swipe left to delete</Text>
                      </View>
                      {isTaken ? (
                        <View style={styles.doneButton}>
                          <Text style={styles.doneText}>DONE</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.takeButton}
                          onPress={(e) => {
                            e.stopPropagation?.();
                            handleTake(item._id, item.name);
                          }}
                        >
                          <Text style={styles.takeText}>TAKE</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              );
            })
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: "#F5F7FA" },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  logo:         { fontSize: 18, fontWeight: "600" },

  // TalkBack bar
  talkbackBar: {
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: "#EEF4FF", borderRadius: 14,
    padding: 14, flexDirection: "row",
    justifyContent: "space-between", alignItems: "center",
    borderWidth: 1.5, borderColor: "#C5D9FF",
  },
  talkbackLeft:  { flexDirection: "row", alignItems: "center", gap: 8 },
  talkbackLabel: { fontSize: 14, fontWeight: "700", color: "#2F6FD6" },
  talkbackBtns:  { flexDirection: "row", gap: 8 },
  readBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#2F6FD6", paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 20,
  },
  readBtnText:  { color: "#fff", fontWeight: "700", fontSize: 13 },
  stopBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#E53935", paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 20,
  },
  stopBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  // Date card
  dateCard:  { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 20 },
  today:     { color: "#2F6FD6", fontWeight: "600", letterSpacing: 1 },
  date:      { fontSize: 18, fontWeight: "600", marginVertical: 4 },
  time:      { fontSize: 28, fontWeight: "700", color: "#2F6FD6" },
  tapHint:   { fontSize: 11, color: "#aaa", marginTop: 6 },

  sectionTitle:  { fontSize: 18, fontWeight: "700", marginHorizontal: 20, marginBottom: 12 },

  // Vitals
  vitalCard:    { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, marginBottom: 15, overflow: "hidden" },
  vitalAccent:  { position: "absolute", left: 0, top: 0, bottom: 0, width: 6 },
  vitalContent: { flexDirection: "row", alignItems: "center", padding: 16 },
  iconCircle:   { padding: 10, borderRadius: 50, marginRight: 12 },
  vitalLabel:   { fontSize: 13, color: "#666" },
  vitalValue:   { fontSize: 20, fontWeight: "700" },
  unit:         { fontSize: 13, fontWeight: "400", color: "#999" },
  badge:        { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText:    { fontSize: 11, fontWeight: "600" },
  cardTapHint:  { fontSize: 11, color: "#bbb", textAlign: "center", paddingBottom: 10 },

  // Medicines
  medsHeader:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, marginBottom: 12 },
  remainingBadge:    { backgroundColor: "#E6F0FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  remainingText:     { color: "#2F6FD6", fontSize: 12, fontWeight: "600" },
  medicineCard:      { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  medicineCardTaken: { opacity: 0.55 },
  medIcon:           { backgroundColor: "#E6F0FF", padding: 12, borderRadius: 16, marginRight: 12 },
  medIconGrey:       { backgroundColor: "#F0F0F0", padding: 12, borderRadius: 16, marginRight: 12 },
  medName:           { fontSize: 16, fontWeight: "600" },
  medNameTaken:      { textDecorationLine: "line-through", color: "#999" },
  medSub:            { fontSize: 12, color: "#666", marginTop: 2 },
  medFreq:           { fontSize: 11, color: "#aaa", marginTop: 2 },
  medTapHint:        { fontSize: 10, color: "#ccc", marginTop: 4 },
  takeButton:        { backgroundColor: "#2F6FD6", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  takeText:          { color: "#fff", fontWeight: "600" },
  doneButton:        { backgroundColor: "#E6F6EC", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  doneText:          { color: "#1DB954", fontWeight: "600" },
  emptyCard:         { alignItems: "center", marginTop: 20, paddingVertical: 30 },
  emptyEmoji:        { fontSize: 40, marginBottom: 8 },
  emptyText:         { color: "#aaa", fontSize: 14 },

  // Swipe delete
  deleteAction: {
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '80%',
    marginVertical: 12,
    borderRadius: 16,
    marginRight: 20,
  },
  deleteActionText: { color: 'white', fontWeight: '600', fontSize: 12, marginTop: 4 },
});