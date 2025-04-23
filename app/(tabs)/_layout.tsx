import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HapticTab } from "@/components/HapticTab";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = "#F2F2F2";
  const inactiveColor = "#8A8A8A";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarStyle: {
          position: 'absolute',
          borderColor: "#121212",
          backgroundColor: '#121212',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          switch (route.name) {
            case "index":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Explore":
              iconName = focused ? "compass" : "compass-outline";
              break;
            case "Wellness":
              iconName = focused ? "heart-circle" : "heart-circle-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Activities":
              iconName = focused ? "checkmark-circle" : "checkmark-circle-outline";
              break;
          }

          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: focused ? -10 : 0,
                backgroundColor: focused ? "#1F1F1F" : "transparent",
                padding: 2,
                borderRadius: 50,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: focused ? 0.2 : 0,
                shadowRadius: 5,
              }}
            >
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="Explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="Activities" options={{ title: "Activities" }} />
      <Tabs.Screen name="Wellness" options={{ title: "Wellness" }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
