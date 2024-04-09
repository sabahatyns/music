import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, PermissionsAndroid, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { Buffer } from "buffer";

const MusicListScreen = ({ navigation }) => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [fetchingMusic, setFetchingMusic] = useState(false);

  const fetchMusic = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to fetch music files.',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setFetchingMusic(true);
        const musicDirectory = RNFS.ExternalStorageDirectoryPath;

        const files = await RNFS.readDir(musicDirectory);

        const musicFiles = files
          .filter((file) => file.isFile() && file.name.endsWith('.mp3'))
          .map((file) => ({
            id: file.path,
            title: file.name.replace('.mp3', ''),
            path: 'file://' + file.path,
          }));

        setMusicFiles(musicFiles);
        setFetchingMusic(false);

        // Show alert if no music files found
        if (musicFiles.length === 0) {
          showAlert();
        }
      } else {
        console.log('Storage permission denied');
      }
    } catch (error) {
      console.error('Error fetching music files:', error);
    }
  };

  const showAlert = () => {
    Alert.alert(
      'No Music Found',
      'No music files were found in your storage.',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
  };

  const handleSongPress = async (item, index) => {
    navigation.navigate('PlayerScreen', {
      title: item.title,
      album: item.album, 
      currentItem: item,
      currentIndex: index,
      yourPlaylist: musicFiles,
      albumCover: item.albumCover
    });
  };



  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleSongPress(item, index)} style={styles.itemContainer}>
      <View style={{ flexDirection: "row" }}>
        {item.albumCover ? (

          <Image source={{ uri: item.albumCover }} style={styles.albumCover} />
        ) : (
          <Image source={require("../assets/img.png")} style={styles.albumCover} />

        )}

        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.artist}>Artist: {item.artist}</Text>
      <Text style={styles.album}>Album: {item.album}</Text>
    </TouchableOpacity>
  );

  const fetchFromCloud = async () => {
    setFetchingMusic(true);
    try {
      // Use your Spotify client ID and secret
      const CLIENT_ID = '0c022f6f4aa64044afa503857d2b1c74';
      const CLIENT_SECRET = '5a54a1eb6349479caccfcb67e8660f2c';

      // Request access token from Spotify
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
          }
        }
      );

      const accessToken = response.data.access_token;

      // access token to fetch music from Spotify API
      const searchResponse = await axios.get(
        'https://api.spotify.com/v1/search',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            q: ' artist:Ed Sheeran',
            type: 'track',
            //limit: 10 // Limiting the number of results to 10
          }
        }
      );

      // Process the search response and update musicFiles state with the fetched music data
      const tracks = searchResponse.data.tracks.items.map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        albumCover: track.album.images[0]?.url,
        previewUrl: track.preview_url
      }));

      setMusicFiles(tracks);
    } catch (error) {
      console.error('Error fetching music from Spotify:', error);
    } finally {
      setFetchingMusic(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.playlistHeading}>Playlist</Text>
      {musicFiles.length === 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={fetchFromCloud} style={[styles.fetchButton, { marginRight: 10 }]}>
            <Text style={styles.fetchButtonText}>Fetch from Spotify</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchMusic} style={styles.fetchButton}>
            <Text style={styles.fetchButtonText}>Fetch from Device Storage</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={musicFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  playlistHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  itemContainer: {
    backgroundColor: '#212121',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  fetchButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  fetchButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  artist: {
    color: "white"
  },
  album: {
    color: "white"
  },
  albumCover:
  {
    height: 25,
    width: 25,
    marginRight: 12,
    borderRadius: 5
  }
});

export default MusicListScreen;
