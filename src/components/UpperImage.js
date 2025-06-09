import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/color/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAppHooks from '../auth/useAppHooks';

const UpperImage = ({back, logo}) => {
  const {navigation} = useAppHooks();
  return (
    <>
      {back && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={Color.white} size={28} />
        </TouchableOpacity>
      )}
      {logo && (
        <View style={{backgroundColor: 'black'}}>
          <View style={styles.logoBox}>
            <View style={styles.logoInnerBox}></View>
          </View>
        </View>
      )}
    </>
  );
};

export default UpperImage;

const styles = StyleSheet.create({
  logoContainer: {},
  logoBox: {
    width: scale(36),
    height: scale(36),
    backgroundColor: Color.white,
    justifyContent: 'center',
    alignItems: 'center',
    top: verticalScale(40),
  },
  logoInnerBox: {
    width: scale(18),
    height: scale(18),
    backgroundColor: Color.blue,
  },
  button: {
    alignSelf: 'flex-start',
    marginVertical: verticalScale(10),
  },
});
