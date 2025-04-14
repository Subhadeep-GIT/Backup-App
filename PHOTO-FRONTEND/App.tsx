// App.tsx or App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IpInputScreen from './app/(tabs)/IP Input Screen';
import UploadScreen from './app/(tabs)/UploadScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IpInput">
        <Stack.Screen name="IpInput" component={IpInputScreen} options={{ title: 'Enter Server IP' }} />
        <Stack.Screen name="Upload" component={UploadScreen} options={{ title: 'Upload Photos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}