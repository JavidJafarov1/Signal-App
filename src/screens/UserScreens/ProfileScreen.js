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
      setProfileData(response); // Make sure response contains `user`
      setImageLoaded(false); // Reset image loader to show new avatar loading
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
      const formData = new FormData();
      formData.append('avatar', {
        uri:
          Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
        type: 'image/jpeg',
        name: image.fileName || 'avatar.jpg',
      });

      setUploadingImage(true);
      try {
        const updatedData = await UploadProfilePhoto(
          profileData?.user?.id,
          token,
          formData,
        );

        setProfileData(updatedData); // updatedData should contain user object
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

  return (
    <ScreenWrapper>
      <Header />
      <View style={{flex: 1}}>
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            {(uploadingImage || !imageLoaded) && (
              <ActivityIndicator size={'small'} color={Color.white} style={styles.imageLoader} />
            )}
            <Image
              style={styles.avatarImage}
              source={{
                uri:
                  profileData?.user?.avatar ||
                  'https://your-fallback-image-url.com/avatar.png',
              }}
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
    marginTop: verticalScale(45),
    paddingHorizontal: scale(20),
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
    marginHorizontal: scale(20),
    borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
