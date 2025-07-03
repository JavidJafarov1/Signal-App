import React, {useState} from 'react';
import {View, Text, Alert, ScrollView} from 'react-native';
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
import LoadingOverlay from '../../components/Loader';

const EmailConfirmationScreen = () => {
  const {navigation, t} = useAppHooks();

  const [email, setEmail] = useState('@gmail.com');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    console.log('----');
  };

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
      Alert.alert(
        'Error',
        error?.response?.data?.error || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={{marginTop: verticalScale(20)}}>
        <UpperImage logo={true} />
        <UpperImage back={true} />
      </View>

      <ScrollView style={{flexGrow: 1}}>
        <TextComponent />
        <View style={{gap: 12}}>
          <CustomTextInput
            placeholder="E-mail"
            value={email}
            onChangeText={text => {
              setEmail(text.toLowerCase());
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
      </ScrollView>

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
          <ButtonComponent
            buttonText={t('G')}
            onButtonPress={handleGoogleLogin}
          />
        </View>
      </View>

      <LoadingOverlay visible={loading} text={t('Loading')} />
    </ScreenWrapper>
  );
};

export default EmailConfirmationScreen;
