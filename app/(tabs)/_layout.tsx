import { Ionicons } from "@expo/vector-icons";
import { type Href, Redirect, Tabs } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "../../src/contexts/AuthContext";
import { colors } from "../../src/theme/colors";

const LOGIN_ROUTE = "/login" as Href;

type TabIconName =
  | "home"
  | "home-outline"
  | "map"
  | "map-outline"
  | "add-circle"
  | "add-circle-outline"
  | "person"
  | "person-outline";

type TabIconProps = {
  focused: boolean;
  color: string;
  activeIcon: TabIconName;
  inactiveIcon: TabIconName;
};

function TabIcon({
  focused,
  color,
  activeIcon,
  inactiveIcon,
}: TabIconProps) {
  return (
    <Ionicons
      name={focused ? activeIcon : inactiveIcon}
      size={focused ? 25 : 23}
      color={color}
    />
  );
}

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.danger} />
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
        tabBarActiveTintColor: colors.danger,
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
            <TabIcon
              focused={focused}
              color={color}
              activeIcon="home"
              inactiveIcon="home-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              activeIcon="map"
              inactiveIcon="map-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              activeIcon="add-circle"
              inactiveIcon="add-circle-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              activeIcon="person"
              inactiveIcon="person-outline"
            />
          ),
        }}
      />

      <Tabs.Screen name="reports" options={{ href: null }} />
      <Tabs.Screen name="analytics" options={{ href: null }} />
      <Tabs.Screen name="education" options={{ href: null }} />
      <Tabs.Screen name="detail" options={{ href: null }} />
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
    height: 72,
    paddingBottom: 11,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    elevation: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: -4,
    },
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
  },
});