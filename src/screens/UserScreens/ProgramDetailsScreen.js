import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import {Color} from '../../assets/color/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScreenWrapper from '../../components/ScreenWrapper';
import useAppHooks from '../../auth/useAppHooks';
import CustomImage from '../../components/ImageComponent';

const ProgramDetailsScreen = () => {
  const {navigation, t, route} = useAppHooks();
  const data = route?.params?.item;

  return (
    <ScreenWrapper>
      <Header />
      <ScrollView>
        <CustomImage
          backgroundImage={{uri: data?.backgroundImage}}
          image={{uri: data?.image}}
          text={data?.text}
          fullSize={true}
        />

        <View style={{paddingTop: verticalScale(20)}}>
          <Text style={styles.textStyle}>{data?.text}</Text>

          <Text style={styles.paragraph}>{data?.paragraph}</Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: Color.gray,
            height: scale(40),
            width: scale(40),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={data?.like ? 'heart' : 'heart-o'}
            size={20}
            color={'white'}
          />
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ProgramDetailsScreen;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: scale(28),
    color: Color.text,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: scale(16),
    color: Color.text,
    letterSpacing: 1,
    lineHeight: 25,
    paddingTop: verticalScale(15),
  },
});
