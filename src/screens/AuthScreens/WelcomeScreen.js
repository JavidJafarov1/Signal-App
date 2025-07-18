import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import {Color} from '../../assets/color/Color';
import UpperImage from '../../components/UpperImage';
import ButtonComponent from '../../components/ButtonComponent';
import TextComponent from '../../components/TextComponent';
import useAppHooks from '../../auth/useAppHooks';
import {verticalScale} from 'react-native-size-matters';

const WelcomeScreen = () => {
  const {navigation, t} = useAppHooks();

  return (
    <ScreenWrapper>
      <View style={{marginTop: verticalScale(20)}}>
        <UpperImage logo={true} />
      </View>

      <View style={{flex: 1, justifyContent: 'center'}}>
        <TextComponent />
        <View style={{gap: 12}}>
          <ButtonComponent
            buttonText={t('Login')}
            buttonStyle={{backgroundColor: Color.white}}
            buttonTextStyle={{color: Color.blue}}
            onButtonPress={() => navigation.navigate('EmailConfirmationScreen')}
          />

          <ButtonComponent
            buttonText={t('Registration')}
            onButtonPress={() => navigation.navigate('RegistrationScreen')}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default WelcomeScreen;
