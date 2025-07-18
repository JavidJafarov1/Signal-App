import React, {useState} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Color} from '../assets/color/Color';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const BackgroundImageWrapper = ({uri, children}) => {
  const [loaded, setLoaded] = useState(false);

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, {duration: 500}),
  }));

  const handleLoad = () => {
    setLoaded(true);
    opacity.value = 1;
  };

  return (
    <View style={styles.container}>
      <AnimatedFastImage
        source={uri}
        style={[StyleSheet.absoluteFillObject, animatedStyle]}
        onLoad={handleLoad}
        resizeMode={FastImage.resizeMode.cover}
      />

      {!loaded && (
        <View style={styles.placeholderWrapper}>
          <Feather name="image" size={22} color={Color.white} />
        </View>
      )}

      {loaded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

export default BackgroundImageWrapper;

const styles = StyleSheet.create({
  container: {
    width: '100%',

    height: 400,

    position: 'relative',

    overflow: 'hidden',

    justifyContent: 'center',

    alignItems: 'center',
  },

  placeholderWrapper: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: '#FFF',
  },

  placeholder: {
    height: 100,

    width: 100,
  },

  content: {
    position: 'absolute',

    zIndex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },
});
