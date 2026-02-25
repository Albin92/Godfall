import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = 'http://192.168.137.249:5000';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alarm-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 5, marginBottom: 30, width: '80%', alignItems: 'center' },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 10 },
  statusText: { fontSize: 18, fontWeight: '800', color: '#007AFF', textAlign: 'center' },
  button: { backgroundColor: '#34C759', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, elevation: 3 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});