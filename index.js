/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import Mixpanel from 'react-native-mixpanel';
import {Amplitude} from '@amplitude/react-native';


// Add the following lines before any other Firebase imports
import '@react-native-firebase/analytics';

// Your Firebase config
const firebaseConfig = {
  // Your Firebase configuration
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

Mixpanel.sharedInstanceWithToken('be442c16c21d045aa3b0e70ca216b580');

///Amplitude.initialize('31bf2ad30df7b2debbc13274553e16e2');

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  
  

AppRegistry.registerComponent(appName, () => App);
