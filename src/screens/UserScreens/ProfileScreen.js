// import React, {useEffect, useState} from 'react';
// import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
// import Feather from 'react-native-vector-icons/Feather';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {Color} from '../../assets/color/Color';
// import {scale, verticalScale} from 'react-native-size-matters';
// import Header from '../../components/Header';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import {Profile} from '../../utils/Apis/AllArtist';
// import {useSelector} from 'react-redux';
// import useAppHooks from '../../auth/useAppHooks';
// import {setuserDetails} from '../../store/reducer/authReducer';
// import {useAuthToken} from '../../utils/api';

// const ProfileScreen = () => {
//   const {navigation, dispatch, t} = useAppHooks();
//   const token = useAuthToken();

//   const [profileData, setProfileData] = useState();

//   const GetProfile = async () => {
//     try {
//       const response = await Profile(token);
//       setProfileData(response?.user);
//     } catch (error) {
//       console.error('Error fetching artists:', error);
//     }
//   };

//   useEffect(() => {
//     GetProfile();
//   }, []);

//   console.log('profileData', profileData?.avatar);

//   return (
//     <ScreenWrapper>
//       <Header />
//       <View style={{flex: 1}}>
//         <View style={styles.profileContainer}>
//           <View style={styles.profileIcon}>
//             <Image
//               style={{width: 80, height: 80}}
//               source={{uri: profileData?.avatar}}
//               resizeMode="cover"
//             />
//             <TouchableOpacity
//               style={{
//                 backgroundColor: 'gray',
//                 padding: scale(8),
//                 position: 'absolute',
//                 borderRadius: 20,
//                 right: 5,
//                 bottom: 5,
//               }}>
//               <AntDesign name={'edit'} size={16} color={Color?.white} />
//             </TouchableOpacity>
//           </View>
//           <View>
//             <Text style={styles.textStyle}>{profileData?.firstName}</Text>
//             <Text style={styles.textStyle}>{profileData?.lastName}</Text>
//           </View>
//         </View>
//       </View>
//       <TouchableOpacity
//         style={styles.loginButton}
//         onPress={() => {
//           dispatch(setuserDetails({}));
//         }}>
//         <Text style={styles.textStyle}>Log Out</Text>
//       </TouchableOpacity>
//     </ScreenWrapper>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: verticalScale(45),
//   },
//   profileIcon: {
//     width: scale(80),
//     height: scale(80),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: scale(15),
//   },
//   textStyle: {
//     color: Color.text,
//     fontSize: scale(18),
//   },
//   infoText: {
//     color: '#888',
//     fontSize: 14,
//     paddingTop: verticalScale(30),
//   },
//   loginButton: {
//     backgroundColor: Color.blue,
//     paddingVertical: verticalScale(15),
//     alignItems: 'center',
//     marginBottom: verticalScale(20),
//   },
// });



import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
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

  const [profileData, setProfileData] = useState();

  const GetProfile = async () => {
    try {
      const response = await Profile(token);
      setProfileData(response?.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
const pickImage = async () => {
  launchImageLibrary({mediaType: 'photo'}, async response => {
    if (response.didCancel || !response.assets || response.assets.length === 0) return;

    const image = response.assets[0];
    console.log('Selected image:', image);

    const formData = new FormData();
    formData.append('avatar', {
      uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
      type: image.type || 'image/jpeg',
      name: image.fileName || `avatar.jpg`,
    });

    try {
      const updatedUser = await UploadProfilePhoto(profileData._id, token, formData);
      setProfileData(updatedUser);
      Alert.alert('Success', 'Profile image updated');
    } catch (err) {
      console.error('Upload error:', err?.response?.data || err);
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
            <Image
              style={{width: 80, height: 80, borderRadius: 40}}
              source={{uri: profileData?.avatar}}
              resizeMode="cover"
            />
            <TouchableOpacity onPress={pickImage} style={styles.editButton}>
              <AntDesign name={'edit'} size={16} color={Color?.white} />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.textStyle}>{profileData?.firstName}</Text>
            <Text style={styles.textStyle}>{profileData?.lastName}</Text>
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
