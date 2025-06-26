import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {launchImageLibrary} from 'react-native-image-picker';
import {Color} from '../../assets/color/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Header from '../../components/Header';
import ScreenWrapper from '../../components/ScreenWrapper';
import {Profile, UploadProfilePhoto} from '../../utils/Apis/AllArtist';
import useAppHooks from '../../auth/useAppHooks';
import {setuserDetails} from '../../store/reducer/authReducer';
import {useAuthToken} from '../../utils/api';

const ProfileScreen = () => {
  const {navigation, dispatch, t} = useAppHooks();
  const token = useAuthToken();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const GetProfile = async () => {
    try {
      const response = await Profile(token);
      setProfileData(response);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const pickImage = async () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (
        response.didCancel ||
        !response.assets ||
        response.assets.length === 0
      ) {
        return;
      }

      const image = response.assets[0];
      console.log('Selected image:', image);

      const formData = new FormData();
      formData.append('avatar', {
        uri:
          Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
        type: 'image/jpeg', 
        name: image.fileName || 'avatar.jpg',
      });
      setLoading(true);
      try {
        const updatedData = await UploadProfilePhoto(
          profileData?.id,
          token,
          formData,
        );

        setProfileData(updatedData.user);
        GetProfile();
        setLoading(false);
        Alert.alert('Success', 'Profile image updated');
      } catch (err) {
        console.error('Upload error:', err?.response?.data || err);
        setLoading(false);
        Alert.alert('Error', 'Could not update avatar');
      }
    });
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
            {loading ? (
              <ActivityIndicator size={'small'} color={Color?.white} />
            ) : (
              <>
                <Image
                  style={{width: 80, height: 80, borderRadius: 40}}
                  source={{
                    uri:
                      profileData?.user?.avatar ||
                      'https://your-fallback-image-url.com/avatar.png',
                  }}
                  resizeMode="cover"
                />
                <TouchableOpacity onPress={pickImage} style={styles.editButton}>
                  <AntDesign name={'edit'} size={16} color={Color?.white} />
                </TouchableOpacity>
              </>
            )}
          </View>
          <View>
            <Text style={styles.textStyle}>
              {profileData?.user?.firstName || ''}
            </Text>
            <Text style={styles.textStyle}>
              {profileData?.user?.lastName || ''}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => dispatch(setuserDetails({}))}>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
  },
  editButton: {
    backgroundColor: 'gray',
    padding: scale(8),
    position: 'absolute',
    borderRadius: 20,
    right: 5,
    bottom: 5,
  },
  textStyle: {
    color: Color.text,
    fontSize: scale(18),
  },
  loginButton: {
    backgroundColor: Color.blue,
    paddingVertical: verticalScale(15),
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
});
