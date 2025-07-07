import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import {Color} from '../../assets/color/Color';
import UpperImage from '../../components/UpperImage';
import ButtonComponent from '../../components/ButtonComponent';
import TextComponent from '../../components/TextComponent';
import useAppHooks from '../../auth/useAppHooks';
import {scale, verticalScale} from 'react-native-size-matters';
import {ForgotPassword, Login} from '../../utils/Apis/AuthApi';
import CustomTextInput from '../../components/Input';
import {setuserDetails} from '../../store/reducer/authReducer';
import {validatePassword} from '../../utils/helpers';
import LoadingOverlay from '../../components/Loader';

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

    try {
      const response = await Login(data);
      if (response?.success === true || response?.token) {
        dispatch(setuserDetails(response));
      }

      Alert.alert('Success', 'User login successfully');
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error || 'Something went wrong';

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

  const handleResetPassword = async () => {
    setLoading(true);
    const data = {
      email: email,
    };

    const params = {
      email: email,
      screen: 'ForgotPassword',
    };

    try {
      const response = await ForgotPassword(data);
      if (
        response?.success === true ||
        response?.message === 'OTP sent to email'
      ) {
        Alert.alert('Error', response?.message, [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('OTPVerificationScreen', {params}),
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

        <TouchableOpacity onPress={handleResetPassword}>
          <Text style={styles.title}>{t('Forgot_your_password')}</Text>
        </TouchableOpacity>
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
});

export default PasswordConfirmationScreen;
