import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {useAuthToken} from '../../../utils/api';
import {Color} from '../../../assets/color/Color';
import {NewGroup} from '../../../utils/Apis/UsersList';
import {useRoute} from '@react-navigation/native';
import useAppHooks from '../../../auth/useAppHooks';
import Header from '../../../components/Header';
import {scale} from 'react-native-size-matters';
import {launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';

const EnterGroupNameScreen = () => {
  const {navigation, t, dispatch} = useAppHooks();
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const token = useAuthToken();
  const [imagePickerLoading, setImagePickerLoading] = useState(false);

  const route = useRoute();
  const {selectedMembers} = route.params;

  const pickImage = () => {
    setImagePickerLoading(true); 
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      response => {
        setImagePickerLoading(false); 

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          setGroupImage(uri);
        }
      },
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Missing Info', 'Please enter a group name.');
      return;
    }

    try {
      const response = await NewGroup(
        groupName,
        selectedMembers,
        groupImage,
        token,
      );
      console.log('response', response);

      Alert.alert('Success', 'Group created successfully!');
      navigation.navigate('ConversationsListScreen');
    } catch (error) {
      console.error('Group creation error:', error);
      Alert.alert('Error', 'Failed to create group.');
    }
  };

  return (
    <ScreenWrapper>
      <View>
        <Header />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imagePickerLoading ? (
            <ActivityIndicator size="small" color={Color?.white} />
          ) : groupImage ? (
            <Image source={{uri: groupImage}} style={styles.groupImage} />
          ) : (
            <AntDesign name="camera" color={Color?.white} size={30} />
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Enter group name"
          value={groupName}
          onChangeText={setGroupName}
          placeholderTextColor={Color.white}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
          <Text style={styles.buttonText}>Create Group</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default EnterGroupNameScreen;

const styles = StyleSheet.create({
  imagePicker: {
    alignSelf: 'center',
    marginVertical: scale(20),
    borderRadius: 75,
    width: 100,
    height: 100,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
  },
  imagePlaceholder: {
    color: 'white',
    fontSize: scale(12),
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    color: Color.white,
    padding: scale(10),
    fontSize: scale(15),
    fontWeight: '600',
  },
  button: {
    backgroundColor: Color?.blue,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(15),
  },
});
