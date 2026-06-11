import { Ionicons } from "@expo/vector-icons";
import { type Href, Redirect, Tabs } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/theme/colors";

const LOGIN_ROUTE = "/login" as Href;

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href={LOGIN_ROUTE} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSoft,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* MAP */}
      <Tabs.Screen
        name="index"
        options={{
          title: "MAP",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* ACTIVITY */}
      <Tabs.Screen
        name="activity"
        options={{
          title: "ACTIVITY",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* REPORT */}
      <Tabs.Screen
        name="report"
        options={{
          title: "REPORT",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  tabBar: {
    height: 75,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border, 
  },

  tabBarLabel: {
    fontSize: 10,
    fontWeight: "900", 
    letterSpacing: 0.5,
  },
});
