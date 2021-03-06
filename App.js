import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Home from './src/screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer  = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Drawer.Navigator initialRouteName="Japanese Dictionary">
        <Drawer.Screen name="Dictionary" component={Home} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
