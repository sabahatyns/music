// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MusicListScreen from './screens/MusicListScreen';
import PlayerScreen from './screens/PlayerScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MusicList" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="MusicList" component={MusicListScreen} />
        <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
