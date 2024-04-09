import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlayerScreen = ({ route, navigation }) => {
  const { title, currentItem, currentIndex, yourPlaylist, albumCover } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    // Cleanup function to stop and release the sound when component unmounts
    return () => {
      if (sound) {
        sound.stop();
        sound.release();
      }
    };
  }, []);

  useEffect(() => {
    if (currentItem) {
      if (sound) {
        sound.stop(); // Stop any existing sound when the currentItem changes
        sound.release(); // Release resources
        setSound(null); // Reset the sound state
      }
      if (currentItem.path || currentItem.previewUrl) {
        const source = currentItem.path || currentItem.previewUrl;
        const newSound = new Sound(source, '', (error) => {
          if (error) {
            console.log('Error loading sound', error);
            Alert.alert('Error', 'Failed to load the audio.');
            return;
          }
          setDuration(newSound.getDuration());
          setSound(newSound);
          setIsPlaying(true);
          newSound.play(() => {
            setIsPlaying(false);
          });
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
          newSound.stop(); // Stop the sound
          newSound.release(); // Release the sound
        };
      }
    }
  }, [currentItem]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
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
    } else {
      console.error("Error: Previous item in playlist is undefined.");
    }
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
});

export default PlayerScreen;
