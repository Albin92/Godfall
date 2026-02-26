import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              icon={<Ionicons name="home" size={22} />}
              label="HOME"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="meds"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              icon={<Ionicons name="medkit-outline" size={22} />}
              label="MEDS"
              focused={focused}
            />
          ),
        }}
      />

      {/* SOS Placeholder (center button) */}
      <Tabs.Screen
        name="sos"
        options={{
          tabBarButton: () => (
            <TouchableOpacity style={styles.sosButton}>
              <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="vitals"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              icon={<Ionicons name="stats-chart" size={22} />}
              label="VITALS"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              icon={<Ionicons name="person-outline" size={22} />}
              label="PROFILE"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function TabItem({ icon, label, focused }: any) {
  return (
    <View style={styles.tabItem}>
      <View style={{ opacity: focused ? 1 : 0.5 }}>
        {icon}
      </View>
      <Text style={[styles.tabLabel, { opacity: focused ? 1 : 0.5 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    color: "#fff",
    
  },
  sosButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 90,
    height: 90,
    borderRadius: 5schr0,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  sosText: {
    color: "#fff",
    fontWeight: "700",
  },
});