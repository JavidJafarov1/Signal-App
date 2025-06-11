import React, {useState, useCallback, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import UpperImage from '../../components/UpperImage';
import useAppHooks from '../../auth/useAppHooks';
import {scale, verticalScale} from 'react-native-size-matters';
import ButtonComponent from '../../components/ButtonComponent';
import {Color} from '../../assets/color/Color';
import CustomTextInput from '../../components/Input';
import {RegisterNewUser} from '../../utils/Apis/AuthApi';
import {validateEmail, validatePassword} from '../../utils/helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import LoadingOverlay from '../../components/Loader';
import Entypo from 'react-native-vector-icons/Entypo';

const countryCodes = [
  {code: '+1', country: 'US', flag: '🇺🇸'},
  {code: '+91', country: 'IN', flag: '🇮🇳'},
  {code: '+44', country: 'UK', flag: '🇬🇧'},
  {code: '+86', country: 'CN', flag: '🇨🇳'},
  {code: '+81', country: 'JP', flag: '🇯🇵'},
  {code: '+49', country: 'DE', flag: '🇩🇪'},
  {code: '+33', country: 'FR', flag: '🇫🇷'},
  {code: '+7', country: 'RU', flag: '🇷🇺'},
  {code: '+55', country: 'BR', flag: '🇧🇷'},
  {code: '+61', country: 'AU', flag: '🇦🇺'},
  {code: '+34', country: 'ES', flag: '🇪🇸'},
  {code: '+39', country: 'IT', flag: '🇮🇹'},
  {code: '+82', country: 'KR', flag: '🇰🇷'},
  {code: '+52', country: 'MX', flag: '🇲🇽'},
  {code: '+31', country: 'NL', flag: '🇳🇱'},
  {code: '+46', country: 'SE', flag: '🇸🇪'},
  {code: '+41', country: 'CH', flag: '🇨🇭'},
  {code: '+47', country: 'NO', flag: '🇳🇴'},
  {code: '+45', country: 'DK', flag: '🇩🇰'},
  {code: '+32', country: 'BE', flag: '🇧🇪'},
];

const RegistrationScreen = () => {
  const {navigation, t, dispatch} = useAppHooks();
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['90%'], []);

  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes[7],
  );
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (key, value) => {
    setForm({...form, [key]: value});
    setError(prev => ({...prev, [key]: ''}));
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCountrySelect = useCallback(country => {
    setSelectedCountryCode(country);
    bottomSheetRef.current?.close();
  }, []);

  const validateForm = () => {
    let valid = true;
    let newError = {};

    if (!form.firstName) {
      newError.firstName = t('First_name_is_required');
      valid = false;
    }
    if (!form.lastName) {
      newError.lastName = t('Last_name_is_required');
      valid = false;
    }

    if (!form.email) {
      newError.email = t('Email_is_required');
      valid = false;
    } else if (!validateEmail(form.email)) {
      newError.email = t('Invalid_email_format');
      valid = false;
    }

    if (!form.phone) {
      newError.phone = t('Phone_number_is_required');
      valid = false;
    } else if (form.phone.length < 8) {
      newError.phone = t('Invalid_phone_number');
      valid = false;
    }

    if (!form.password) {
      newError.password = t('Password_is_required');
      valid = false;
    } else if (!validatePassword(form.password)) {
      newError.password = t('Invalid_password');
      valid = false;
    }

    if (!form.confirmPassword) {
      newError.confirmPassword = t('Confirm password is required');
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newError.confirmPassword = t('Passwords_do_not_match');
      valid = false;
    }

    if (!isChecked) {
      newError.checkbox = t('Please_agree_to_the_privacy_policy');
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const params = {
    email: form?.email,
    screen: 'Registration',
  };

  const handleOTPVerification = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await RegisterNewUser(form);
        if (
          response?.message ===
            'User registered successfully and OTP sent successfully' ||
          response?.success === true
        ) {
          Alert.alert('Success', response?.message, [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('OTPVerificationScreen', {
                  params,
                }),
            },
          ]);
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.error || 'Something went wrong';

        if (errorMessage === 'User already exists') {
          Alert.alert('Error', errorMessage, [
            {
              text: 'OK',
              onPress: () => navigation.navigate('EmailConfirmationScreen'),
            },
          ]);
        } else {
          Alert.alert('Error', errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const renderCountryItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.countryItem}
        onPress={() => handleCountrySelect(item)}>
        <Text style={styles.countryFlag}>{item?.flag}</Text>
        <Text style={styles.countryText}>{item?.country}</Text>
        <Text style={styles.countryCode}>{item?.code}</Text>
      </TouchableOpacity>
    ),
    [handleCountrySelect],
  );

  return (
    <ScreenWrapper>
      <View style={{marginTop: verticalScale(20)}}>
        <UpperImage logo={true} />
        <UpperImage back={true} />
      </View>

      <ScrollView style={{flexGrow: 1}}>
        <Text style={styles.title}>{t('Registration')}</Text>

        <View style={{gap: 12}}>
          <CustomTextInput
            placeholder={t('Name')}
            value={form?.firstName}
            onChangeText={text => handleChange('firstName', text)}
          />
          {error.firstName && (
            <Text style={styles.error}>{error.firstName}</Text>
          )}

          <CustomTextInput
            placeholder={t('Last_name')}
            value={form?.lastName}
            onChangeText={text => handleChange('lastName', text)}
          />
          {error.lastName && <Text style={styles.error}>{error.lastName}</Text>}

          <CustomTextInput
            placeholder={t('E-mail')}
            value={form?.email}
            onChangeText={text => handleChange('email', text)}
            keyboardType="email-address"
          />
          {error.email && <Text style={styles.error}>{error.email}</Text>}
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.countryCodeSelector}
              onPress={handlePresentModalPress}>
              <Text style={styles.countryFlag}>{selectedCountryCode.flag}</Text>
              <Text style={styles.selectedCountryCode}>
                {selectedCountryCode.code}
              </Text>
              <Icon name="keyboard-arrow-down" size={20} color={Color.text} />
            </TouchableOpacity>

            <CustomTextInput
              placeholder={t('Phone_number')}
              value={form?.phone}
              onChangeText={text => handleChange('phone', text)}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          {error.phone && <Text style={styles.error}>{error.phone}</Text>}

          <CustomTextInput
            placeholder={t('Enter_password')}
            value={form?.password}
            onChangeText={text => handleChange('password', text)}
            secure={true}
          />
          {error.password && <Text style={styles.error}>{error.password}</Text>}

          <CustomTextInput
            placeholder={t('Repeat_password')}
            value={form?.confirmPassword}
            onChangeText={text => handleChange('confirmPassword', text)}
            secure={true}
          />
          {error.confirmPassword && (
            <Text style={styles.error}>{error.confirmPassword}</Text>
          )}
        </View>

        <View
          style={[
            styles.checkboxContainer,
            !error?.checkbox && {marginBottom: verticalScale(50)},
          ]}>
          <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
            <View
              style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
              {isChecked && (
                <Entypo name="check" size={16} color={Color.black} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            {t('I_agree_with_the_privacy_policy')}
          </Text>
        </View>
        {error.checkbox && (
          <Text style={[styles.error, {marginBottom: verticalScale(30)}]}>
            {error.checkbox}
          </Text>
        )}
      </ScrollView>

      <ButtonComponent
        buttonText={t('Continue')}
        onButtonPress={handleOTPVerification}
        buttonStyle={{bottom: verticalScale(20)}}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}>
        <View style={{flex: 1}}>
          <Text style={styles.bottomSheetTitle}>
            {t('Select_country_code')}
          </Text>

          <BottomSheetFlatList
            data={countryCodes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCountryItem}
            contentContainerStyle={{paddingBottom: 20}}
          />
        </View>
      </BottomSheet>

      <LoadingOverlay visible={loading} text={t('Loading')} />
    </ScreenWrapper>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  title: {
    color: Color.text,
    fontSize: scale(24),
    fontWeight: '600',
    paddingVertical: verticalScale(10),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(20),
    width: '100%',
  },
  checkboxText: {
    color: Color.text,
    marginLeft: scale(8),
    flex: 1,
    flexWrap: 'wrap',
  },
  checkbox: {
    width: scale(16),
    height: scale(16),
    borderWidth: 1,
    borderColor: Color.text,
  },
  checkboxChecked: {
    backgroundColor: Color.text,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: scale(5),
  },
  countryCodeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.gray,
    paddingHorizontal: scale(10),
    height: scale(46),
  },
  countryFlag: {
    fontSize: scale(20),
    marginRight: scale(8),
  },
  selectedCountryCode: {
    color: Color.text,
    fontSize: scale(16),
    marginRight: scale(4),
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Color.gray,
  },
  countryText: {
    color: Color.text,
    fontSize: 16,
    flex: 1,
    marginLeft: scale(10),
  },
  countryCode: {
    color: Color.text,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSheetBackground: {
    backgroundColor: Color.backgroundColor,
  },
  bottomSheetIndicator: {
    backgroundColor: Color.text,
  },
  bottomSheetTitle: {
    color: Color.text,
    fontSize: scale(18),
    fontWeight: '600',
    paddingVertical: verticalScale(10),
  },
});
