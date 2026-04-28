import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ffaaaa',
        tabBarStyle: {
          backgroundColor: '#C0392B',
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>🚨</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Education',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>📚</Text>
          ),
        }}
      />
    </Tabs>
  );
}