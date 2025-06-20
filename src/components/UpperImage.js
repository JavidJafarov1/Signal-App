import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/color/Color';
import useAppHooks from '../auth/useAppHooks';
import Feather from 'react-native-vector-icons/Feather';

const UpperImage = ({back, logo, style, innerStyle}) => {
  const {navigation} = useAppHooks();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.log('back does nothing');
    }
  };
  return (
    <View style={{}}>
      {back && (
        <View>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Feather name="chevron-left" size={scale(20)} color="white" />
          </TouchableOpacity>
        </View>
      )}
      {logo && (
        <View>
          <View style={[styles.logoBox, style]}>
            <View style={[styles.logoInnerBox, innerStyle]}></View>
          </View>
        </View>
      )}
    </View>
  );
};

export default UpperImage;

const styles = StyleSheet.create({
  logoBox: {
    width: scale(36),
    height: scale(36),
    backgroundColor: Color.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInnerBox: {
    width: scale(18),
    height: scale(18),
    backgroundColor: Color.blue,
  },
  button: {
    alignSelf: 'flex-start',
    marginVertical: verticalScale(15),
    width: scale(36),
    height: scale(36),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.gray,
  },
});
