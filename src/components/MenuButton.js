import React, {useEffect} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const AnimatedHamburger = ({isOpen, toggle}) => {
  const rotationTop = useSharedValue(0);
  const rotationBottom = useSharedValue(0);
  const middleOpacity = useSharedValue(1);
  const topY = useSharedValue(-10);
  const bottomY = useSharedValue(10);

  useEffect(() => {
    if (isOpen) {
      rotationTop.value = withTiming(45, {duration: 300});
      rotationBottom.value = withTiming(-45, {duration: 300});
      topY.value = withTiming(0, {duration: 300});
      bottomY.value = withTiming(0, {duration: 300});
      middleOpacity.value = withTiming(0, {duration: 300});
    } else {
      rotationTop.value = withTiming(0, {duration: 300});
      rotationBottom.value = withTiming(0, {duration: 300});
      topY.value = withTiming(-10, {duration: 300});
      bottomY.value = withTiming(10, {duration: 300});
      middleOpacity.value = withTiming(1, {duration: 300});
    }
  }, [isOpen]);

  const topStyle = useAnimatedStyle(() => ({
    transform: [{translateY: topY.value}, {rotateZ: `${rotationTop.value}deg`}],
  }));

  const middleStyle = useAnimatedStyle(() => ({
    opacity: middleOpacity.value,
  }));

  const bottomStyle = useAnimatedStyle(() => ({
    transform: [
      {translateY: bottomY.value},
      {rotateZ: `${rotationBottom.value}deg`},
    ],
  }));

  return (
    <Pressable onPress={toggle}>
      <View style={styles.container}>
        <Animated.View style={[styles.line, topStyle]} />
        <Animated.View style={[styles.line, middleStyle]} />
        <Animated.View style={[styles.line, bottomStyle]} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    width: 30,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
});

export default AnimatedHamburger;
