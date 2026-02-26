import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from 'expo-speech';

// ⚠️ Hackathon check: Ensure this IP is still correct for your current Wi-Fi!
const BACKEND_URL = 'http://192.168.137.17:5000'; 

export default function TabLayout() {

  // --- SOS Trigger Logic ---
  const handleSOSTrigger = () => {
    Alert.alert(
      "Emergency SOS",
      "Are you sure you want to trigger the SOS alert?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "SEND SOS", 
          style: "destructive",
          onPress: sendSOSRequest 
        }
      ]
    );
  };

  const sendSOSRequest = async () => {
    try {
      // ⚠️ REPLACE +91YOUR_REAL_NUMBER with the one you verified in Twilio!
      const response = await fetch(`${BACKEND_URL}/api/sos/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: "user_123",
          userName: "Abdul Basith K A", 
          location: { latitude: 13.0827, longitude: 80.2707 }, // Hardcoded for demo
          contactNumber: "+916362434977" 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert("SOS Sent!", "Emergency contacts are being called.");
        
        // --- TEXT TO SPEECH (SUCCESS) ---
        Speech.speak("Emergency SOS activated. Contacts are being notified. Please remain calm.", {
          language: 'en',
          pitch: 1,
          rate: 0.85 // Slightly slower so it sounds clear and calming
        });

      } else {
        Alert.alert("Error", "Could not send SOS.");
        
        // --- TEXT TO SPEECH (FAIL) ---
        Speech.speak("Failed to send SOS. Please try again.", {
            language: 'en',
            pitch: 1,
            rate: 0.9 
        });
      }
    } catch (error) {
      console.error("SOS Fetch Error:", error);
      Alert.alert("Network Error", "Could not reach the server.");
      
      // --- TEXT TO SPEECH (NETWORK ERROR) ---
      Speech.speak("Network error. Could not reach the server.", {
        language: 'en',
        pitch: 1,
        rate: 0.9 
      });
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true, 
        tabBarActiveTintColor: "#007AFF", 
        tabBarInactiveTintColor: "#8E8E93", 
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="meds"
        options={{
          title: "MEDS",
          tabBarIcon: ({ color }) => <Ionicons name="medkit" size={24} color={color} />,
        }}
      />

      {/* --- Centered Live SOS Button --- */}
      <Tabs.Screen
        name="sos"
        options={{
          title: "", // No text under the center button
          tabBarButton: () => (
            <View style={styles.sosWrapper}>
              <TouchableOpacity style={styles.sosButton} onPress={handleSOSTrigger}>
                <Text style={styles.sosText}>SOS</Text>
                <Text style={styles.sosSubText}>EMERGENCY</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="vitals"
        options={{
          title: "VITALS",
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "white",
    elevation: 10, 
    borderTopWidth: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  sosWrapper: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
  },
  sosButton: {
    top: -25, 
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E63946",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 4,
    borderColor: "#FCA5A5", 
  },
  sosText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },
  sosSubText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  }
});