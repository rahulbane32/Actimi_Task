import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LeaderBoardTab from './tabs/LeaderBoardTab';
import ProfileSettingstab from './tabs/ProfileSettings';
import ProfileTab from './tabs/ProfileTab';

import { AuthProvider } from './AuthContext'; 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const MainScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Welcome! 👋</Text>
  </View>
);

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarIcon: ({ focused }) => {
          let emoji;

          if (route.name === 'Home') {
            emoji = focused ? '🏠' : '🏡';
          } else if (route.name === 'Leaderboard') {
            emoji = focused ? '🏆' : '📊';
          } else if (route.name === 'Profile') {
            emoji = focused ? '👤' : '👥';
          }

          return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderBoardTab} />
      <Tab.Screen name="Profile" component={ProfileSettingstab} />
    </Tab.Navigator>
  );
}

// 👇 MAIN APP WRAPPED IN AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileTab"
            component={ProfileTab}
            options={{ title: 'User Profile' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, marginBottom: 16, color: '#6200ee', fontWeight: 'bold' },
});
