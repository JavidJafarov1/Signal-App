import React, {useState} from 'react';
import {View, StyleSheet, Text, Alert, ActivityIndicator} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import {Color} from '../../assets/color/Color';
import UpperImage from '../../components/UpperImage';
import ButtonComponent from '../../components/ButtonComponent';
import TextComponent from '../../components/TextComponent';
import useAppHooks from '../../auth/useAppHooks';
import {scale, verticalScale} from 'react-native-size-matters';
import {Login} from '../../utils/Apis/AuthApi';
import CustomTextInput from '../../components/Input';
import {setAuthToken} from '../../store/reducer/authReducer';
import {validatePassword} from '../../utils/helpers';

const PasswordConfirmationScreen = () => {
  const {navigation, t, route, dispatch} = useAppHooks();
  const email = route?.params?.email;

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordConfirmation = async () => {
    if (!password) {
      setError(t('Password_is_required'));
      return;
    }
    if (!validatePassword(password)) {
      setError(t('Please_enter_a_valid_password'));
      return;
    }

    setError('');

    const data = {
      email: email,
      password: password,
    };

    setLoading(true);
    try {
      const response = await Login(data);
      if (response?.success === true || response?.token) {
        dispatch(setAuthToken(response?.token));
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || '';

      if (errorMessage === 'Please verify OTP before logging in') {
        Alert.alert('Error', errorMessage, [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('OTPVerificationScreen', {email}),
          },
        ]);
      } else {
        Alert.alert('Error', errorMessage);
      }
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
        <CustomTextInput
          placeholder={t('Enter_password')}
          value={password}
          onChangeText={text => {
            setPassword(text);
            setError('');
          }}
          secure={true}
        />
        {error ? (
          <Text style={{color: 'red', marginLeft: scale(10)}}>{error}</Text>
        ) : null}

        <Text style={styles.title}>{t('Forgot_your_password')}</Text>
      </View>
      <ButtonComponent
        buttonText={t('Login')}
        buttonStyle={{backgroundColor: Color.white, bottom: verticalScale(20)}}
        buttonTextStyle={{color: Color.blue}}
        onButtonPress={handlePasswordConfirmation}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    color: Color.text,
    fontSize: scale(14),
    fontWeight: '600',
    paddingTop: verticalScale(15),
    alignSelf: 'flex-end',
  },
});

export default PasswordConfirmationScreen;
