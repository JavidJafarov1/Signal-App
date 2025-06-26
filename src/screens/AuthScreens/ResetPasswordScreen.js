import React, {useState} from 'react';
import {View, StyleSheet, Text, Alert, ScrollView} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import {Color} from '../../assets/color/Color';
import UpperImage from '../../components/UpperImage';
import ButtonComponent from '../../components/ButtonComponent';
import TextComponent from '../../components/TextComponent';
import useAppHooks from '../../auth/useAppHooks';
import {scale, verticalScale} from 'react-native-size-matters';
import {ResetPasswordConfirmation} from '../../utils/Apis/AuthApi';
import CustomTextInput from '../../components/Input';
import {validatePassword} from '../../utils/helpers';
import LoadingOverlay from '../../components/Loader';

const ResetPasswordScreen = () => {
  const {navigation, t, route, dispatch} = useAppHooks();
  const email = route?.params?.email;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordConfirmation = async () => {
    setPasswordError('');
    setConfirmPasswordError('');

    if (!password) {
      setPasswordError(t('Password_is_required'));
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError(t('Please_enter_a_valid_password'));
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(t('Confirm_password_is_required'));
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(t('Passwords_do_not_match'));
      return;
    }

    setLoading(true);
    try {
      const response = await ResetPasswordConfirmation({
        email: email,
        password: password,
      });

      Alert.alert(t('Success'), t('Password_reset_successful'), [
        {
          text: t('OK'),
          onPress: () => navigation.navigate('LoginScreen'),
        },
      ]);
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert(t('Error'), error?.message || t('Password_reset_failed'));
    } finally {
      setLoading(false);
    }
    console.log('reset');
  };

  return (
    <ScreenWrapper>
      <View style={{marginTop: verticalScale(20)}}>
        <UpperImage logo={true} />
        <UpperImage back={true} />
      </View>

      <ScrollView style={{flexGrow: 1}}>
        <TextComponent />
        <View style={{gap: scale(12)}}>
          <CustomTextInput
            placeholder={t('Enter_password')}
            value={password}
            onChangeText={text => {
              setPassword(text);
              setPasswordError('');
            }}
            secure={true}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <CustomTextInput
            placeholder={t('Repeat_password')}
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              setConfirmPasswordError('');
            }}
            secure={true}
          />
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
        </View>
      </ScrollView>

      <ButtonComponent
        buttonText={t('Login')}
        buttonStyle={{backgroundColor: Color.white, bottom: verticalScale(20)}}
        buttonTextStyle={{color: Color.blue}}
        onButtonPress={handlePasswordConfirmation}
      />

      <LoadingOverlay visible={loading} text={t('Loading')} />
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
  errorText: {
    color: 'red',
    marginLeft: scale(10),
    fontSize: scale(12),
  },
});

export default ResetPasswordScreen;
