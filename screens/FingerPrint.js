import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import TouchID from 'react-native-touch-id';
import { useNavigation } from '@react-navigation/native';

const Fingerprint = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const navigation = useNavigation();

  const checkBiometrySupport = async () => {
    try {
      const biometryType = await TouchID.isSupported();
      setIsSupported(true);
      setBiometryType(biometryType);
    } catch (error) {
      setIsSupported(false);
      console.error('Biometry not supported:', error);
    }
  };

  const handleAuthenticate = async () => {
    try {
      const success = await TouchID.authenticate('Authenticate with your fingerprint');
      if (success) {
        console.log('Fingerprint authentication successful');
        // Proceed with the authenticated action
        navigation.navigate('MusicList'); // Navigate to the home screen
      } else {
        console.log('Fingerprint authentication failed');
      }
    } catch (error) {
      console.error('Fingerprint authentication error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isSupported && (
        <>
          <Text style={styles.text}>{`Biometry type supported: ${biometryType}`}</Text>
          <Button title="Authenticate with Fingerprint" onPress={handleAuthenticate} />
        </>
      )}
      {!isSupported && (
        <Text style={styles.text}>Biometry not supported on this device</Text>
      )}
      <Button title="Check Biometry Support" onPress={checkBiometrySupport} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Fingerprint;
