import {StyleSheet, Text, View, Alert, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import {OtpInput} from 'react-native-otp-entry';
import {Color} from '../../assets/color/Color';
import UpperImage from '../../components/UpperImage';
import ButtonComponent from '../../components/ButtonComponent';
import useAppHooks from '../../auth/useAppHooks';
import {verticalScale} from 'react-native-size-matters';
import {OTPVerification} from '../../utils/Apis/AuthApi';
import {setAuthToken} from '../../store/reducer/authReducer';

const OTPVerificationScreen = () => {
  const {navigation, t, dispatch, route} = useAppHooks();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const email = route?.params?.email;

  const handleRegister = async () => {
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
        dispatch(setAuthToken(email));
      } else {
        Alert.alert('Error', 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.error ||
          error?.message ||
          'Something went wrong',
      );
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
            containerStyle: styles.container,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            placeholderTextStyle: styles.placeholderText,
            filledPinCodeContainerStyle: styles.filledPinCodeContainer,
            disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
          }}
        />

        {loading && <Text style={styles.loadingText}>Verifying OTP...</Text>}
      </View>

      <ButtonComponent
        buttonText={loading ? t('Verifying') : t('Register')}
        buttonStyle={{bottom: verticalScale(20)}}
        onButtonPress={handleRegister}
        disabled={loading}
      />
    </ScreenWrapper>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  pinCodeText: {
    color: Color.text,
  },
  loadingText: {
    color: Color.text,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
