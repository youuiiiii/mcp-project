import { Ionicons } from "@expo/vector-icons";
import { Href, Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { useAuth } from "../../src/contexts/AuthContext";

const LOGIN_ROUTE = "/login" as Href;

type TabIconName =
  | "home"
  | "home-outline"
  | "map"
  | "map-outline"
  | "add-circle"
  | "add-circle-outline"
  | "stats-chart"
  | "stats-chart-outline"
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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8FAFC",
        }}
      >
        <ActivityIndicator size="large" color="#DC2626" />
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
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#DC2626",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          height: 72,
          paddingBottom: 11,
          paddingTop: 9,
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          backgroundColor: "#FFFFFF",
          elevation: 10,
          shadowColor: "#0F172A",
          shadowOpacity: 0.1,
          shadowRadius: 14,
          shadowOffset: {
            width: 0,
            height: -4,
          },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "900",
          marginTop: 2,
        },
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
        name="analytics"
        options={{
          title: "Stats",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              activeIcon="stats-chart"
              inactiveIcon="stats-chart-outline"
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
      <Tabs.Screen name="education" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="detail" options={{ href: null }} />
    </Tabs>
  );
}