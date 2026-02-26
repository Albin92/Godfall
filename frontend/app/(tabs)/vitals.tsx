import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const BACKEND_URL = "http://192.168.137.249:5000";

const getBPStatus = (s: string, d: string) => {
  const sys = parseInt(s), dia = parseInt(d);
  if (isNaN(sys) || isNaN(dia)) return { label: "—", style: "badgeGrey" };
  if (sys < 120 && dia < 80)    return { label: "NORMAL",   style: "badgeGreen" };
  if (sys <= 129 && dia < 80)   return { label: "ELEVATED", style: "badgeYellow" };
  return { label: "HIGH", style: "badgeRed" };
};
const getHRStatus = (v: string) => {
  const n = parseInt(v);
  if (isNaN(n))            return { label: "—",      style: "badgeGrey" };
  if (n >= 60 && n <= 100) return { label: "STABLE", style: "badgeBlue" };
  if (n < 60)              return { label: "LOW",    style: "badgeYellow" };
  return { label: "HIGH", style: "badgeRed" };
};
const getSpo2Status = (v: string) => {
  const n = parseInt(v);
  if (isNaN(n))  return { label: "—",        style: "badgeGrey" };
  if (n >= 95)   return { label: "NORMAL",   style: "badgeGreen" };
  if (n >= 90)   return { label: "LOW",      style: "badgeYellow" };
  return { label: "CRITICAL", style: "badgeRed" };
};
const getSugarStatus = (v: string) => {
  const n = parseInt(v);
  if (isNaN(n))  return { label: "—",            style: "badgeGrey" };
  if (n < 100)   return { label: "NORMAL",        style: "badgeGreen" };
  if (n <= 125)  return { label: "PRE-DIABETIC",  style: "badgeYellow" };
  return { label: "HIGH", style: "badgeRed" };
};

export default function VitalsScreen() {
  const [systolic, setSystolic]   = useState("118");
  const [diastolic, setDiastolic] = useState("76");
  const [heartRate, setHeartRate] = useState("72");
  const [spo2, setSpo2]           = useState("99");
  const [sugar, setSugar]         = useState("140");
  const [savingBP, setSavingBP]       = useState(false);
  const [savingHR, setSavingHR]       = useState(false);
  const [savingSpo2, setSavingSpo2]   = useState(false);
  const [savingSugar, setSavingSugar] = useState(false);

  // ── Delete old records of this type, then POST new one ───────
  const saveVital = async (
    type: string,
    value: Record<string, string>,
    setLoading: (v: boolean) => void
  ) => {
    setLoading(true);
    try {
      // 1️⃣ Delete all old records of this vital type
      await fetch(`${BACKEND_URL}/api/vitals/type/${encodeURIComponent(type)}`, {
        method: "DELETE",
      });

      // 2️⃣ Save the fresh record
      const res = await fetch(`${BACKEND_URL}/api/vitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...value, recordedAt: new Date().toISOString() }),
      });
      const json = JSON.parse(await res.text());
      if (json.status === "success") {
        Alert.alert("✅ Updated", `${type} updated successfully!`);
      } else {
        Alert.alert("Server Error", json.message || "Something went wrong.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const bpStatus    = getBPStatus(systolic, diastolic);
  const hrStatus    = getHRStatus(heartRate);
  const spo2Status  = getSpo2Status(spo2);
  const sugarStatus = getSugarStatus(sugar);

  const bgStyle  = (k: string) => (styles as any)[k]       || styles.badgeGrey;
  const txtStyle = (k: string) => (styles as any)[k + "Text"] || styles.badgeGreyText;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Vitals Dashboard</Text>

      {/* Blood Pressure */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.leftRow}>
            <Ionicons name="water-outline" size={18} color="#2F6FD6" />
            <Text style={styles.cardTitle}>Blood Pressure</Text>
          </View>
          <View style={bgStyle(bpStatus.style)}>
            <Text style={txtStyle(bpStatus.style)}>{bpStatus.label}</Text>
          </View>
        </View>
        <View style={styles.bpRow}>
          <TextInput value={systolic}  onChangeText={setSystolic}  keyboardType="numeric" style={styles.bpInput} />
          <Text style={styles.slash}>/</Text>
          <TextInput value={diastolic} onChangeText={setDiastolic} keyboardType="numeric" style={styles.bpInput} />
          <Text style={styles.unit}>mmHg</Text>
        </View>
        <TouchableOpacity style={[styles.saveBtn, savingBP && { opacity: 0.6 }]} disabled={savingBP}
          onPress={() => saveVital("Blood Pressure", { systolic, diastolic }, setSavingBP)}>
          {savingBP ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveText}>Update</Text>}
        </TouchableOpacity>
      </View>

      {/* Heart Rate */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.leftRow}>
            <Ionicons name="heart-outline" size={18} color="#E53935" />
            <Text style={styles.cardTitle}>Heart Rate</Text>
          </View>
          <View style={bgStyle(hrStatus.style)}>
            <Text style={txtStyle(hrStatus.style)}>{hrStatus.label}</Text>
          </View>
        </View>
        <View style={styles.valueRow}>
          <TextInput value={heartRate} onChangeText={setHeartRate} keyboardType="numeric" style={styles.bigInput} />
          <Text style={styles.unit}>BPM</Text>
        </View>
        <TouchableOpacity style={[styles.saveBtn, savingHR && { opacity: 0.6 }]} disabled={savingHR}
          onPress={() => saveVital("Heart Rate", { heartRate }, setSavingHR)}>
          {savingHR ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveText}>Update</Text>}
        </TouchableOpacity>
      </View>

      {/* SpO2 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.leftRow}>
            <MaterialCommunityIcons name="water-percent" size={18} color="#2ECC71" />
            <Text style={styles.cardTitle}>SpO2</Text>
          </View>
          <View style={bgStyle(spo2Status.style)}>
            <Text style={txtStyle(spo2Status.style)}>{spo2Status.label}</Text>
          </View>
        </View>
        <View style={styles.valueRow}>
          <TextInput value={spo2} onChangeText={setSpo2} keyboardType="numeric" style={styles.bigInput} />
          <Text style={styles.unit}>%</Text>
        </View>
        <TouchableOpacity style={[styles.saveBtn, savingSpo2 && { opacity: 0.6 }]} disabled={savingSpo2}
          onPress={() => saveVital("SpO2", { spo2 }, setSavingSpo2)}>
          {savingSpo2 ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveText}>Update</Text>}
        </TouchableOpacity>
      </View>

      {/* Blood Sugar */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.leftRow}>
            <Ionicons name="flame-outline" size={18} color="#9C27B0" />
            <Text style={styles.cardTitle}>Blood Sugar</Text>
          </View>
          <View style={bgStyle(sugarStatus.style)}>
            <Text style={txtStyle(sugarStatus.style)}>{sugarStatus.label}</Text>
          </View>
        </View>
        <View style={styles.valueRow}>
          <TextInput value={sugar} onChangeText={setSugar} keyboardType="numeric" style={styles.bigInput} />
          <Text style={styles.unit}>mg/dL</Text>
        </View>
        <TouchableOpacity style={[styles.saveBtn, savingSugar && { opacity: 0.6 }]} disabled={savingSugar}
          onPress={() => saveVital("Blood Sugar", { sugar }, setSavingSugar)}>
          {savingSugar ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveText}>Update</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#F5F7FA", paddingHorizontal: 20 },
  title:       { fontSize: 20, fontWeight: "700", marginVertical: 20 },
  card:        { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 20 },
  cardHeader:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  leftRow:     { flexDirection: "row", alignItems: "center", gap: 6 },
  cardTitle:   { fontSize: 14, fontWeight: "600" },
  // Badge BGs
  badgeGreen:  { backgroundColor: "#E8F5E9", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeBlue:   { backgroundColor: "#E3F2FD", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeYellow: { backgroundColor: "#FFF8E1", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeRed:    { backgroundColor: "#FFEBEE", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeGrey:   { backgroundColor: "#F0F0F0", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  // Badge Texts
  badgeGreenText:  { fontSize: 10, fontWeight: "600", color: "#2E7D32" },
  badgeBlueText:   { fontSize: 10, fontWeight: "600", color: "#1565C0" },
  badgeYellowText: { fontSize: 10, fontWeight: "600", color: "#F57F17" },
  badgeRedText:    { fontSize: 10, fontWeight: "600", color: "#C62828" },
  badgeGreyText:   { fontSize: 10, fontWeight: "600", color: "#888" },
  bpRow:    { flexDirection: "row", alignItems: "flex-end", justifyContent: "center" },
  bpInput:  { fontSize: 28, fontWeight: "700", width: 60, textAlign: "center" },
  slash:    { fontSize: 28, fontWeight: "700", marginHorizontal: 6 },
  valueRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center" },
  bigInput: { fontSize: 32, fontWeight: "700", textAlign: "center" },
  unit:     { marginLeft: 6, fontSize: 12, color: "#666", marginBottom: 6 },
  saveBtn:  { marginTop: 15, backgroundColor: "#2F6FD6", paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "600" },
});