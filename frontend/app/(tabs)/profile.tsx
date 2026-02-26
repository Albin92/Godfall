import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#2F6FD6" />
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Text style={styles.name}>Anjali Jayaraj</Text>
        <Text style={styles.memberSince}>Member since Oct 2020</Text>

        <Image
          source={{
            uri: "https://i.imgur.com/4A7Q8yG.png",
          }}
          style={styles.avatar}
        />

        <View style={styles.phoneContainer}>
          <Feather name="phone" size={16} color="#2F6FD6" />
          <Text style={styles.phoneText}>+91-8921759104</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.primaryButton}>
          <View style={styles.buttonLeft}>
            <Ionicons name="person-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              Edit Personal Info
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton}>
          <View style={styles.buttonLeft}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              Caregiver Portal
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <View style={styles.buttonLeft}>
            <Ionicons name="settings-outline" size={20} color="#333" />
            <Text style={styles.secondaryButtonText}>
              App Settings
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#E53935" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Support Box */}
        <View style={styles.supportBox}>
          <Ionicons name="help-circle-outline" size={20} color="#2F6FD6" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.supportTitle}>Need assistance?</Text>
            <Text style={styles.supportText}>
              Call our support team anytime at 1800-100-100
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
  },

  memberSince: {
    color: "#666",
    marginBottom: 15,
  },

  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 15,
  },

  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },

  phoneText: {
    marginLeft: 6,
    color: "#2F6FD6",
    fontWeight: "600",
  },

  buttonSection: {
    paddingHorizontal: 20,
  },

  primaryButton: {
    backgroundColor: "#2F6FD6",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },

  buttonLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  secondaryButton: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#333",
    fontWeight: "600",
    marginLeft: 8,
  },

  logoutButton: {
    backgroundColor: "#FFEBEE",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#E53935",
    fontWeight: "600",
    marginLeft: 8,
  },

  supportBox: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  supportTitle: {
    fontWeight: "600",
  },

  supportText: {
    color: "#555",
    fontSize: 12,
  },
});