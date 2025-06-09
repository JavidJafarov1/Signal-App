import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {Color} from '../assets/color/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import ScreenWrapper from './ScreenWrapper';

const {height} = Dimensions.get('window');

const TopDrawer = ({visible, onClose}) => {
  const translateY = useSharedValue(-height);
  const navigation = useNavigation();

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : -height, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [visible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const menuItems = [
    {id: 0, title: 'Артисты', onPress: 'HomeScreen'},
    {id: 1, title: 'Таймлайн', onPress: 'TimelineScreen'},
    {id: 2, title: 'Программа', onPress: 'ProgramScreen'},
    {id: 3, title: 'Карта', onPress: 'MapScreen'},
    {id: 4, title: 'Signal Live', onPress: 'SignalLiveScreen'},
    {id: 5, title: 'Партнеры', onPress: 'PartnersScreen'},
  ];

  const handleMenuPress = screenName => {
    onClose();
    navigation.navigate(screenName);
  };

  return (
    <>
      {visible && <Pressable style={styles.backdrop} onPress={onClose} />}
      <Animated.View style={[styles.drawer, animatedStyle]}>
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            style={styles.iconButton}
            accessibilityLabel="Close drawer">
            <Feather name="x" size={24} color="#FFF" />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            accessibilityLabel="User profile"
            onPress={() => navigation.navigate('ProfileScreen')}>
            <Feather name="user" size={24} color="#FFF" />
          </Pressable>
        </View>

        <View
          style={{paddingHorizontal: scale(16), paddingTop: verticalScale(30)}}>
          <FlatList
            data={menuItems}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.onPress)}>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.socialContainer}>
            {['sc', 'vk', 'tg'].map((platform, index) => (
              <Pressable key={index}>
                <Text style={styles.socialText}>{platform.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default TopDrawer;

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: Color.backgroundColor,
    zIndex: 1000,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
  },
  iconButton: {
    padding: 12,
    backgroundColor: '#0E0E0E',
  },
  menuItem: {
    paddingVertical: verticalScale(10),
  },
  menuText: {
    color: '#FFF',
    fontSize: scale(22),
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    paddingTop: verticalScale(40),
    gap: 20,
  },
  socialText: {
    color: '#FFF',
    fontSize: scale(20),
    fontWeight: '400',
  },
});
