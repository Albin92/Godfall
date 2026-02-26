import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function VitalsScreen() {
  const [systolic, setSystolic] = useState("118");
  const [diastolic, setDiastolic] = useState("76");
  const [heartRate, setHeartRate] = useState("72");
  const [spo2, setSpo2] = useState("99");
  const [sugar, setSugar] = useState("140");

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
          <View style={styles.badgeGreen}>
            <Text style={styles.badgeText}>NORMAL</Text>
          </View>
        </View>

        <View style={styles.bpRow}>
          <TextInput
            value={systolic}
            onChangeText={setSystolic}
            keyboardType="numeric"
            style={styles.bpInput}
          />
          <Text style={styles.slash}>/</Text>
          <TextInput
            value={diastolic}
            onChangeText={setDiastolic}
            keyboardType="numeric"
            style={styles.bpInput}
          />
          <Text style={styles.unit}>mmHg</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Heart Rate */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.leftRow}>
            <Ionicons name="heart-outline" size={18} color="#E53935" />
            <Text style={styles.cardTitle}>Heart Rate</Text>
          </View>
          <View style={styles.badgeBlue}>
            <Text style={styles.badgeText}>STABLE</Text>
          </View>
        </View>

        <View style={styles.valueRow}>
          <TextInput
            value={heartRate}
            onChangeText={setHeartRate}
            keyboardType="numeric"
            style={styles.bigInput}
          />
          <Text style={styles.unit}>BPM</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* SpO2 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.leftRow}>
            <MaterialCommunityIcons name="water-percent" size={18} color="#2ECC71" />
            <Text style={styles.cardTitle}>SpO2</Text>
          </View>
          <View style={styles.badgeGreen}>
            <Text style={styles.badgeText}>NORMAL</Text>
          </View>
        </View>

        <View style={styles.valueRow}>
          <TextInput
            value={spo2}
            onChangeText={setSpo2}
            keyboardType="numeric"
            style={styles.bigInput}
          />
          <Text style={styles.unit}>%</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Blood Sugar */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.leftRow}>
            <Ionicons name="flame-outline" size={18} color="#9C27B0" />
            <Text style={styles.cardTitle}>Blood Sugar</Text>
          </View>
          <View style={styles.badgeGreen}>
            <Text style={styles.badgeText}>NORMAL</Text>
          </View>
        </View>

        <View style={styles.valueRow}>
          <TextInput
            value={sugar}
            onChangeText={setSugar}
            keyboardType="numeric"
            style={styles.bigInput}
          />
          <Text style={styles.unit}>mg/dL</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  badgeGreen: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeBlue: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },

  bpRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },

  bpInput: {
    fontSize: 28,
    fontWeight: "700",
    width: 60,
    textAlign: "center",
  },

  slash: {
    fontSize: 28,
    fontWeight: "700",
    marginHorizontal: 6,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },

  bigInput: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },

  unit: {
    marginLeft: 6,
    fontSize: 12,
    color: "#666",
  },

  saveBtn: {
    marginTop: 15,
    backgroundColor: "#2F6FD6",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
});