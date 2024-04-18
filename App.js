import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MusicListScreen from './screens/MusicListScreen';
import PlayerScreen from './screens/PlayerScreen';
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission, notificationListenr, getToken } from './utils/pushnotifications';
import crashlytics from '@react-native-firebase/crashlytics'; // Import Crashlytics
import ProductDetailScreen from './components/ProductDetailScreen';
import { Provider } from 'react-redux';
import store from './components/redux/store';
import CartScreen from './components/CartScreen';


const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // // Initialize Firebase
    // if (!firebase.apps.length) {
    //   firebase.initializeApp({ /* Add your Firebase config here */ });
    // }
    
    // Enable Crashlytics reporting
    //crashlytics().enableCrashlytics();
    
    // Set up Firebase Cloud Messaging
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  // Request user permission, listen for notifications, and get token
  useEffect(() => {
    requestUserPermission();
    notificationListenr();
    getToken();
  }, []);

  return (
    <Provider store={store}>

    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductDetail" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />

       {/* // <Stack.Screen name="MusicList" component={MusicListScreen} /> */}
        {/* <Stack.Screen name="PlayerScreen" component={PlayerScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    
    </Provider>
  );
};

export default App;
