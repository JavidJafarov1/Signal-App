import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import TopDrawer from './TopDrawer';
import {Color} from '../assets/color/Color';
import {scale, verticalScale} from 'react-native-size-matters';

const Header = ({singleIcon = false}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigation = useNavigation();

  const handleDrawerToggle = () => {
    setDrawerVisible(prev => !prev);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.log('back does nothing');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleDrawerToggle}>
            <Feather name="menu" size={20} color={Color.white} />
          </TouchableOpacity>

          {!singleIcon && (
            <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
              <Feather name="chevron-left" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ProfileScreen')}>
          <Feather name="user" size={20} color={Color.white} />
        </TouchableOpacity>
      </View>

      <TopDrawer visible={drawerVisible} onClose={handleDrawerClose} />
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(20),
    backgroundColor: 'transparent',
  },
  leftIcons: {
    flexDirection: 'row',
    gap: 5,
  },
  iconButton: {
    padding: 12,
    backgroundColor: Color.gray,
  },
});
