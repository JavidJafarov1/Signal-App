import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Color} from '../../assets/color/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Header from '../../components/Header';
import ScreenWrapper from '../../components/ScreenWrapper';
import {Profile} from '../../utils/Apis/AllArtist';
import {useSelector} from 'react-redux';
import useAppHooks from '../../auth/useAppHooks';
import {setAuthToken} from '../../store/reducer/authReducer';

const ProfileScreen = () => {
  const {navigation, dispatch, t} = useAppHooks();
  const token = useSelector(state => state?.auth?.authToken);

  const [profileData, setProfileData] = useState();
  console.log('response', profileData);

  const GetProfile = async () => {
    try {
      const response = await Profile(token);
      setProfileData(response?.user);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  useEffect(() => {
    GetProfile();
  }, []);

  return (
    <ScreenWrapper>
      <Header />
      <View style={{flex: 1}}>
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Text style={styles.textStyle}>?</Text>
          </View>
          <View>
            {/* <Text style={styles.textStyle}>Привет,</Text>

            <Text style={styles.textStyle}>Вы вошли как гость.</Text> */}
            <Text style={styles.textStyle}>{profileData?.firstName}</Text>
            <Text style={styles.textStyle}>{profileData?.lastName}</Text>
          </View>
        </View>

        {/* <Text style={styles.infoText}>
          Для доступа ко всем функциям раздела Signal People необходимо войти
          или зарегистрироваться
        </Text> */}
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          dispatch(setAuthToken(''));
        }}>
        <Text style={styles.textStyle}>Log Out</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(45),
  },
  profileIcon: {
    width: scale(80),
    height: scale(80),
    backgroundColor: '#0E0E0E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
  },
  textStyle: {
    color: Color.text,
    fontSize: scale(18),
  },
  infoText: {
    color: '#888',
    fontSize: 14,
    paddingTop: verticalScale(30),
  },
  loginButton: {
    backgroundColor: Color.blue,
    paddingVertical: verticalScale(15),
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
});
