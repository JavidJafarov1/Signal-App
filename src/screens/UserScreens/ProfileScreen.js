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
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const GetProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await Profile(token);
      setProfileData(response);
      setImageLoaded(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoadingProfile(false);
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

      const uri =
        Platform.OS === 'android'
          ? image.uri
          : image.uri.replace('file://', '');
      const fileName = image.fileName || `avatar_${Date.now()}.jpg`;
      const mimeType = image.type || 'image/jpeg';

      const formData = new FormData();
      formData.append('avatar', {
        uri,
        name: fileName,
        type: mimeType,
      });

      setUploadingImage(true);
      try {
        const updatedData = await UploadProfilePhoto(
          profileData?.user?._id || profileData?.id,
          token,
          formData,
        );

        setProfileData(updatedData);
        Alert.alert('Success', 'Profile image updated');
        setImageLoaded(false);
      } catch (err) {
        console.error('Upload error:', err?.response?.data || err);
        Alert.alert('Error', 'Could not update avatar');
      } finally {
        setUploadingImage(false);
      }
    });
  };

  useEffect(() => {
    GetProfile();
  }, []);

  if (loadingProfile) {
    return (
      <ScreenWrapper>
        <Header />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Color.blue} />
        </View>
      </ScreenWrapper>
    );
  }

  const profileImage = profileData?.user?.avatar
    ? {uri: profileData?.user?.avatar}
    : require('../../assets/image/avatar.png');

  return (
    <ScreenWrapper>
      <Header />
      <View style={{flex: 1}}>
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            {(uploadingImage || !imageLoaded) && (
              <ActivityIndicator
                size={'small'}
                color={Color.white}
                style={styles.imageLoader}
              />
            )}
            <Image
              style={styles.avatarImage}
              source={profileImage}
              resizeMode="cover"
              onLoadEnd={() => setImageLoaded(true)}
            />
            <TouchableOpacity onPress={pickImage} style={styles.editButton}>
              <AntDesign name={'edit'} size={16} color={Color.white} />
            </TouchableOpacity>
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
        style={styles.logoutbutton}
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
  },
  profileIcon: {
    width: scale(80),
    height: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
  },
  editButton: {
    backgroundColor: 'gray',
    padding: scale(8),
    position: 'absolute',
    borderRadius: 20,
    right: 5,
    bottom: 5,
    zIndex: 2,
  },
  textStyle: {
    color: Color.text,
    fontSize: scale(18),
  },
  logoutbutton: {
    backgroundColor: Color.blue,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    marginBottom: verticalScale(20),
    borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsTxt: {
    color: Color?.white,
  },
});
