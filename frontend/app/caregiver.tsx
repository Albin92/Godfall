import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function CaregiverScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="grid-outline" size={22} />
        <Text style={styles.headerTitle}>Caregiver Portal</Text>
        <Ionicons name="notifications-outline" size={22} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: "https://i.imgur.com/4A7Q8yG.png" }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Anjali Jayaraj</Text>
          <Text style={styles.lastSeen}>
            Last seen: 8 mins ago at Home
          </Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Resting</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionRow}>
        <View style={styles.metricCard}>
          <Ionicons name="heart-outline" size={18} color="#E53935" />
          <Text style={styles.metricValue}>72 BPM</Text>
          <Text style={styles.metricSub}>Stable</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="moon-outline" size={18} color="#2F6FD6" />
          <Text style={styles.metricValue}>7h 20m</Text>
          <Text style={styles.metricSub}>+5%</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <View style={styles.metricCard}>
          <Ionicons name="walk-outline" size={18} color="#FF9800" />
          <Text style={styles.metricValue}>1,240</Text>
          <Text style={styles.metricSub}>Goal: 3,000</Text>
        </View>

        <View style={styles.metricCard}>
          <MaterialCommunityIcons
            name="water-percent"
            size={18}
            color="#2ECC71"
          />
          <Text style={styles.metricValue}>4/8</Text>
          <Text style={styles.metricSub}>Glasses</Text>
        </View>
      </View>

      {/* Alerts */}
      <Text style={styles.sectionTitle}>Alerts & Timeline</Text>

      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>Missed Medication</Text>
        <Text style={styles.alertText}>
          Eleanor missed her 8:00 AM Blood Pressure pill.
        </Text>
      </View>

      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Morning Walk</Text>
        <Text style={styles.timelineText}>
          20-minute walk completed around the neighborhood.
        </Text>
      </View>

      {/* Invite Card */}
      <View style={styles.inviteCard}>
        <Text style={styles.inviteTitle}>Add Another Caregiver</Text>
        <Text style={styles.inviteCode}>HLTH - 92X1</Text>
        <TouchableOpacity style={styles.copyBtn}>
          <Text style={{ color: "#fff" }}>Copy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  name: {
    fontWeight: "600",
  },

  lastSeen: {
    fontSize: 12,
    color: "#666",
  },

  statusBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  metricCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 15,
    borderRadius: 16,
  },

  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 5,
  },

  metricSub: {
    fontSize: 12,
    color: "#666",
  },

  sectionTitle: {
    fontWeight: "600",
    marginVertical: 15,
  },

  alertCard: {
    backgroundColor: "#FFEBEE",
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
  },

  alertTitle: {
    fontWeight: "600",
    color: "#C62828",
  },

  alertText: {
    fontSize: 12,
    marginTop: 5,
  },

  timelineCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
  },

  timelineTitle: {
    fontWeight: "600",
  },

  timelineText: {
    fontSize: 12,
    marginTop: 5,
  },

  inviteCard: {
    borderWidth: 1,
    borderColor: "#2F6FD6",
    borderStyle: "dashed",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  inviteTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },

  inviteCode: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  copyBtn: {
    backgroundColor: "#2F6FD6",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
});