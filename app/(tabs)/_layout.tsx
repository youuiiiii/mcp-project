import { Ionicons } from "@expo/vector-icons";
import { type Href, Redirect, Tabs } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

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
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: ({ focused }) => (
            <View style={styles.fabContainer}>
              <View style={[styles.fab, focused && styles.fabFocused]}>
                <Ionicons
                  name={focused ? "megaphone" : "megaphone-outline"}
                  size={28}
                  color={colors.surface}
                />
              </View>
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={[styles.reportLabel, focused && styles.reportLabelActive]}
            >
              Report
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Incident",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "warning" : "warning-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="incident/[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
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
    height: 88,
    paddingBottom: 14,
    paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },

  tabBarLabel: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 3,
    textTransform: "none",
  },

  fabContainer: {
    position: "absolute",
    top: -24,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F04E4E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.surface,
    shadowColor: "#F04E4E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  fabFocused: {
    backgroundColor: colors.dangerDark,
  },
  reportLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textSoft,
    marginTop: 12, // Tweaked to align properly without pushing it off the screen
  },
  reportLabelActive: {
    color: colors.danger,
  },
});
