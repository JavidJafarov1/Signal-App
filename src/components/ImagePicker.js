import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission to take pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};

const CustomImagePicker = ({onImageSelected}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const handleImageSelection = response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      Alert.alert('Error', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0];
      setImageUri(selectedImage.uri);
      onImageSelected?.(selectedImage);
    }
    setModalVisible(false);
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      launchCamera({mediaType: 'photo', quality: 1}, handleImageSelection);
    } else {
      Alert.alert(
        'Permission denied',
        'Camera access is required to take pictures.',
      );
    }
  };

  const openGallery = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, handleImageSelection);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.pickButtonText}>Pick an Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{uri: imageUri}} style={styles.imagePreview} />
      )}

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Image From</Text>
            <Pressable style={styles.modalButton} onPress={openGallery}>
              <Text style={styles.modalButtonText}>📁 Gallery</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={openCamera}>
              <Text style={styles.modalButtonText}>📷 Camera</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
  },
  pickButton: {
    backgroundColor: '#2e86de',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  modalButtonText: {
    fontSize: 16,
  },
});

export default CustomImagePicker;
