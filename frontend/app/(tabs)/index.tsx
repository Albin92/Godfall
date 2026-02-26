import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="menu" size={24} color="#333" />
          <Text style={styles.logo}>MediCare+</Text>
          <Ionicons name="person-circle-outline" size={28} color="#2F6FD6" />
        </View>

        {/* Date Card */}
        <View style={styles.dateCard}>
          <Text style={styles.today}>TODAY IS</Text>
          <Text style={styles.date}>Wednesday, Feb 25</Text>
          <Text style={styles.time}>09:30 PM</Text>
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

        {/* Medicines */}
        <View style={styles.medsHeader}>
          <Text style={styles.sectionTitle}>Today's Medicines</Text>
          <View style={styles.remainingBadge}>
            <Text style={styles.remainingText}>2 Remaining</Text>
          </View>
        </View>

        {/* Medicine Card */}
        <View style={styles.medicineCard}>
          <View style={styles.medIcon}>
            <Ionicons name="medical" size={22} color="#2F6FD6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.medName}>Aspirin</Text>
            <Text style={styles.medSub}>Take with food</Text>
          </View>
          <TouchableOpacity style={styles.takeButton}>
            <Text style={styles.takeText}>TAKE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medicineCard}>
          <View style={styles.medIconGrey}>
            <Ionicons name="medkit-outline" size={22} color="#777" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.medName}>Vitamin D3</Text>
            <Text style={styles.medSub}>1:00 PM</Text>
          </View>
          <View style={styles.waitButton}>
            <Text style={styles.waitText}>WAIT</Text>
          </View>
        </View>

      </ScrollView>

      {/* Floating SOS */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  logo: {
    fontSize: 18,
    fontWeight: "600",
  },

  dateCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  today: {
    color: "#2F6FD6",
    fontWeight: "600",
    letterSpacing: 1,
  },

  date: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 4,
  },

  time: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2F6FD6",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginBottom: 12,
  },

  vitalCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
  },

  vitalLeftGreen: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: "#1DB954",
  },

  vitalLeftYellow: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: "#F4A100",
  },

  vitalContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },

  iconCircleGreen: {
    backgroundColor: "#E6F6EC",
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
  },

  iconCircleYellow: {
    backgroundColor: "#FFF3E0",
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
  },

  vitalLabel: {
    fontSize: 14,
    color: "#666",
  },

  vitalValue: {
    fontSize: 20,
    fontWeight: "700",
  },

  unit: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
  },

  badgeGreen: {
    backgroundColor: "#E6F6EC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeYellow: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: "#1DB954",
    fontSize: 12,
    fontWeight: "600",
  },

  badgeTextYellow: {
    color: "#F4A100",
    fontSize: 12,
    fontWeight: "600",
  },

  medsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },

  remainingBadge: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  remainingText: {
    color: "#2F6FD6",
    fontSize: 12,
    fontWeight: "600",
  },

  medicineCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  medIcon: {
    backgroundColor: "#E6F0FF",
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
  },

  medIconGrey: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
  },

  medName: {
    fontSize: 16,
    fontWeight: "600",
  },

  medSub: {
    fontSize: 12,
    color: "#666",
  },

  takeButton: {
    backgroundColor: "#2F6FD6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  takeText: {
    color: "#fff",
    fontWeight: "600",
  },

  waitButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  waitText: {
    color: "#555",
    fontWeight: "600",
  },

  sosButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#ffff",
    width: 90,
    height: 90,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E53935",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },

  sosText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  sosSub: {
    color: "#fff",
    fontSize: 10,
    letterSpacing: 1,
  },
});