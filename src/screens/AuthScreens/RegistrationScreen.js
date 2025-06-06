import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import UpperImage from '../../components/UpperImage';
import useAppHooks from '../../auth/useAppHooks';
import InputComponent from '../../components/Input';
import { verticalScale } from 'react-native-size-matters';
import ButtonComponent from '../../components/ButtonComponent';
import { Color } from '../../assets/color/Color';

const RegistrationScreen = () => {
  const { navigation, t } = useAppHooks();

  const [isChecked, setIsChecked] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = () => {
    // Handle registration logic here
  };

  return (
    <ScreenWrapper>
      <UpperImage />


      <View style={{ flex: 1, justifyContent: 'center' }}>

        <Text style={styles.title}>{t('Registration')}</Text>

        <View style={{ gap: 12 }}>

          <InputComponent
            placeholder={t('Name')}
            value={form?.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />

          <InputComponent
            placeholder={t('Last_name')}
            value={form?.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />

          <InputComponent
            placeholder={t('E-mail')}
            value={form?.email}
            onChangeText={(text) => handleChange('email', text)}
          />

          <InputComponent
            placeholder={t('Phone_number')}
            value={form?.phone}
            onChangeText={(text) => handleChange('phone', text)}
          />

          <InputComponent
            placeholder={t('Enter_password')}
            value={form?.password}
            onChangeText={(text) => handleChange('password', text)}
          />

          <InputComponent
            placeholder={t('Repeat_password')}
            value={form?.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxText}>
            {t('I_agree_with_the_privacy_policy')}
          </Text>
        </View>

      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', bottom: verticalScale(50), gap: 12 }}>
        <View style={{ flex: 1 }}>
          <ButtonComponent buttonText={t('Register')} />
        </View>
      </View>


    </ScreenWrapper>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  logoBox: {
    width: 25,
    height: 25,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: verticalScale(20)
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#ffffff20',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: Color.text,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  checkboxText: {
    color: Color.text,
    marginLeft: 8,
    flex: 1,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#0000FF',
    fontWeight: 'bold',
  },
});
