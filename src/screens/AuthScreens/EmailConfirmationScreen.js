import React, {useState} from 'react';
import {View, StyleSheet, Text, Alert, ActivityIndicator} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import {Color} from '../../assets/color/Color';
import UpperImage from '../../components/UpperImage';
import ButtonComponent from '../../components/ButtonComponent';
import TextComponent from '../../components/TextComponent';
import useAppHooks from '../../auth/useAppHooks';
import {scale, verticalScale} from 'react-native-size-matters';
import {CheckUserExistOrNot} from '../../utils/Apis/AuthApi';
import CustomTextInput from '../../components/Input';
import {validateEmail} from '../../utils/helpers';

const EmailConfirmationScreen = () => {
  const {navigation, t} = useAppHooks();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailConfiguration = async () => {
    if (!email) {
      setError(t('Email_is_required'));
      return;
    }
    if (!validateEmail(email)) {
      setError(t('Please_enter_a_valid_email_address'));
      return;
    }

    setError('');

    setLoading(true);
    try {
      const response = await CheckUserExistOrNot(email);
      if (response?.isExists) {
        navigation.navigate('PasswordConfirmationScreen', {email});
      } else {
        Alert.alert('Error', response?.message, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('RegistrationScreen', {email}),
          },
        ]);
      }
    } catch (error) {
      console.error('Email configuration error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Color.backgroundColor,
        }}>
        <ActivityIndicator size="large" color={Color.white} />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <UpperImage logo={true} back={true} />
      <View style={{flex: 1, justifyContent: 'center'}}>
        <TextComponent />
        <View style={{gap: 12}}>
          <CustomTextInput
            placeholder="E-mail"
            value={email}
            onChangeText={text => {
              setEmail(text);
              setError('');
            }}
            keyboardType="email-address"
          />
          {error ? (
            <Text style={{color: 'red', marginLeft: scale(10)}}>{error}</Text>
          ) : null}
          <ButtonComponent
            buttonText={t('Continue')}
            buttonStyle={{backgroundColor: Color.white}}
            buttonTextStyle={{color: Color.blue}}
            onButtonPress={handleEmailConfiguration}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          bottom: verticalScale(20),
          gap: 12,
        }}>
        <View style={{flex: 1}}>
          <ButtonComponent buttonText={t('VK')} />
        </View>
        <View style={{flex: 1}}>
          <ButtonComponent buttonText={t('G')} />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default EmailConfirmationScreen;
