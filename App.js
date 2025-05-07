import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import "./global.css"; // Import global styles

import HomePage from './screens/HomePage';
import WeatherPage from './screens/WeatherPage';
import MotorControlPage from './screens/MotorControlPage';

import { Ionicons } from '@expo/vector-icons'; // For tab icons

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Weather') iconName = 'cloudy';
            else if (route.name === 'Motor') iconName = 'power';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#d3d3d3',
          tabBarStyle: {
            backgroundColor: '#4a6b3e',
          },
          headerStyle: {
            backgroundColor: '#4a6b3e',
          },
          headerTintColor: 'white', // Text color in header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Weather" component={WeatherPage} />
        <Tab.Screen name="Motor" component={MotorControlPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
