import {StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import {OtpInput} from 'react-native-otp-entry';
import {Color} from '../../assets/color/Color';
import UpperImage from '../../components/UpperImage';
import ButtonComponent from '../../components/ButtonComponent';
import useAppHooks from '../../auth/useAppHooks';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  ForgotOTPVerification,
  OTPVerification,
  ResendOTPVerification,
} from '../../utils/Apis/AuthApi';
import LoadingOverlay from '../../components/Loader';

const OTPVerificationScreen = () => {
  const {navigation, t, dispatch, route} = useAppHooks();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const email = route?.params?.params?.email;

  const screen = route?.params?.params?.screen;

  const handleRegister = () => {
    if (screen === 'ForgotPassword') {
      ForgotPasswordOTP();
    } else if (screen === 'Registration') {
      verifyOTP();
    }
  };

  const ForgotPasswordOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }
    setLoading(true);

    try {
      const data = {
        email: email,
        otp: otp,
      };
      console.log('data', data);

      const response = await ForgotOTPVerification(data);
      if (
        response?.message === 'OTP verified successfully' ||
        response?.success === true
      ) {
        navigation.navigate('EmailConfirmationScreen');
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

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }
    setLoading(true);

    try {
      const data = {
        email: email,
        otp: otp,
      };

      const response = await OTPVerification(data);
      if (
        response?.message === 'OTP verified successfully' ||
        response?.success === true
      ) {
        navigation.navigate('EmailConfirmationScreen');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.error || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
    console.log('verify');
  };

  const handleResendOTP = async () => {
    setLoading(true);

    try {
      const response = await ResendOTPVerification(email);
      console.log('response', response);
      if (
        response?.message === 'OTP resent successfully' ||
        response?.success === true
      ) {
        Alert.alert('Success', response?.message);
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

      <Text style={styles.title}>{t('Enter_your_OTP')}</Text>
      <View style={{flex: 1}}>
        <OtpInput
          numberOfDigits={6}
          focusColor={Color.white}
          autoFocus={false}
          hideStick={true}
          blurOnFilled={true}
          disabled={loading}
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          onFocus={() => console.log('Focused')}
          onBlur={() => console.log('Blurred')}
          onTextChange={text => {
            setOtp(text);
          }}
          textInputProps={{
            accessibilityLabel: 'One-Time Password',
          }}
          textProps={{
            accessibilityRole: 'text',
            accessibilityLabel: 'OTP digit',
            allowFontScaling: false,
          }}
          theme={{
            containerStyle: {marginVertical: verticalScale(20)},
            pinCodeTextStyle: {color: Color.text},
            focusedPinCodeContainerStyle: {backgroundColor: Color.gray},
          }}
        />

        <TouchableOpacity onPress={handleResendOTP}>
          <Text
            style={[styles.title, {fontSize: scale(16), textAlign: 'center'}]}>
            {t('Resend')}
          </Text>
        </TouchableOpacity>
      </View>

      <ButtonComponent
        buttonText={t('Register')}
        buttonStyle={{bottom: verticalScale(20)}}
        onButtonPress={handleRegister}
      />

      <LoadingOverlay visible={loading} text={t('Loading')} />
    </ScreenWrapper>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  title: {
    color: Color.text,
    fontSize: scale(24),
    fontWeight: '600',
    paddingVertical: verticalScale(10),
  },
});
