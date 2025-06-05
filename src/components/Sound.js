import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

const App = () => {
    const [sound, setSound] = useState(null);

    useEffect(() => {
        // Initialize sound with error handling and callback
        const loadedSound = new Sound(require('../assets/sound/sound.mp3'), (error) => {
            if (error) {
                console.log('Failed to load the sound', error);
                return;
            }
            console.log('Sound loaded successfully');
            setSound(loadedSound);
        });

        // Cleanup on unmount
        return () => {
            if (loadedSound) {
                loadedSound.release();
            }
        };
    }, []);

    const playSound = () => {
        if (sound) {
            // Reset the sound to the beginning before playing
            sound.setCurrentTime(0);

            sound.play((success) => {
                if (success) {
                    console.log('Sound played successfully');
                } else {
                    console.log('Playback failed due to audio decoding errors');
                }
            });
        } else {
            console.log('Sound not loaded yet');
        }
    };

    const stopSound = () => {
        if (sound) {
            sound.stop(() => {
                console.log('Sound stopped');
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>React Native Sound Example</Text>
            <Button title="Play Sound" onPress={playSound} />
            <View style={styles.spacer} />
            <Button title="Stop Sound" onPress={stopSound} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    spacer: {
        height: 20,
    },
});

export default App;