import messaging from '@react-native-firebase/messaging';



export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export const notificationListenr=()=>{
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open in background',
            remoteMessage.notification,
            
        )
    })
    messaging()
    .getInitialNotification()
    .then(remoteMessage=>{
        if(remoteMessage){
            console.log(
                'notification caused app to open in quit state',
                remoteMessage.notification,
            )
        }
    })
}
export const getToken = async()=>{
    await messaging().registerDeviceForRemoteMessages();
const token = await messaging().getToken();
console.log(token);
}
