import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';
import crashlytics from '@react-native-firebase/crashlytics'; // Import Crashlytics
import analytics from '@react-native-firebase/analytics'; // Import Analytics
import Mixpanel from 'react-native-mixpanel';



const PlayerScreen = ({ route, navigation }) => {
  const { title, currentItem, currentIndex, yourPlaylist, albumCover } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (currentItem && (currentItem.path || currentItem.previewUrl)) {
      const source = currentItem.path || currentItem.previewUrl;
      const newSound = new Sound(source, '', (error) => {
        if (error) {
          console.log('Error loading sound', error);
          crashlytics().recordError(error); // Log error to Crashlytics
          Alert.alert('Error', 'Failed to load the audio.');
          return;
        }
        setDuration(newSound.getDuration());
        setSound(newSound);
        setIsPlaying(true);
        newSound.play(() => {
          setIsPlaying(false);
        });
        // Log play event to Analytics
        analytics().logEvent('play_song', { song_title: currentItem.title });
      });

      const interval = setInterval(() => {
        if (sound && isPlaying) {
          newSound.getCurrentTime((seconds) => {
            setCurrentTime(seconds);
            setProgress(seconds / duration);
          });
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        newSound.stop();
        newSound.release();
      };
    }
  }, [currentItem]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (sound) {
      if (isPlaying) {
        sound.pause();
        // Log pause event to Analytics
        analytics().logEvent('pause_song', { song_title: currentItem.title });
      } else {
        sound.play();
        // Log play event to Analytics
        analytics().logEvent('play_song', { song_title: currentItem.title });
      }
    }
    Mixpanel.track(isPlaying ? 'Song Paused' : 'Song Played');

  };

  const playNext = () => {
    if (sound) {
      sound.stop();
    }
    const nextIndex = (currentIndex + 1) % yourPlaylist.length;
    const nextItem = yourPlaylist[nextIndex];
    if (nextItem) {
      navigation.navigate('PlayerScreen', {
        title: nextItem.title,
        currentItem: nextItem,
        currentIndex: nextIndex,
        yourPlaylist,
        albumCover: nextItem.albumCover
      });
      Mixpanel.track('Next Song Played');

      // Log play next event to Analytics
      analytics().logEvent('play_next_song', { song_title: nextItem.title });
    } else {
      console.error("Error: Next item in playlist is undefined.");
      console.log('Your Playlist:', yourPlaylist);
    }

  };

  const playPrevious = () => {
    if (sound) {
      sound.stop();
    }
    const previousIndex = currentIndex === 0 ? yourPlaylist.length - 1 : currentIndex - 1;
    const previousItem = yourPlaylist[previousIndex];
    if (previousItem) {
      navigation.navigate('PlayerScreen', {
        title: previousItem.title,
        currentItem: previousItem,
        currentIndex: previousIndex,
        yourPlaylist,
        albumCover: previousItem.albumCover
      });
      Mixpanel.track('Previous Song Played');

      // Log play previous event to Analytics
      analytics().logEvent('play_previous_song', { song_title: previousItem.title });
    } else {
      console.error("Error: Previous item in playlist is undefined.");
    }
  };

  // Method to force a crash
  const forceCrash = () => {
    crashlytics().crash(); // Force crash to test Crashlytics
  };

  return (
    <View style={styles.container}>
      {albumCover ? (
        <Image source={{ uri: albumCover }} style={styles.albumArtwork} />
      ) : (
        <Image source={require("../assets/img.png")} style={styles.albumArtwork} />
      )}
      <Text style={styles.title}>{currentItem.title}</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={playPrevious}>
          <Icon name="step-backward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayback}>
          <Icon name={isPlaying ? "pause" : "play"} size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext}>
          <Icon name="step-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.duration}>{formatTime(currentTime)} / {formatTime(duration)}</Text>
      <View style={styles.progressBar}>
        <View style={{ width: `${progress * 100}%`, backgroundColor: '#FFFFFF', height: 5 }} />
      </View>
      {/* Button to force crash */}
      <TouchableOpacity onPress={forceCrash} style={styles.crashButton}>
        <Text style={styles.crashButtonText}>Force Crash</Text>
      </TouchableOpacity>
    </View>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  albumArtwork: {
    width: 260,
    height: 260,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    width: '60%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    marginBottom: 20,
    paddingTop: 20
  },
  duration: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  progressBar: {
    width: '80%',
    height: 5,
    backgroundColor: '#444444',
  },
  crashButton: {
    marginTop: 20,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  crashButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default PlayerScreen;
