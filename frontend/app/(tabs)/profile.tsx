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
            uri: "data:image/jpeg;base64,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",
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