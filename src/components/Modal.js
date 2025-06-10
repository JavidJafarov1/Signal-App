import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {scale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

const {width} = Dimensions.get('window');

const CustomModal = ({isVisible, onClose, modalData}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View
            style={{height: '62%', width: '100%', backgroundColor: 'black'}}
          />
          <Text style={styles.artistName}>{modalData?.name}</Text>

          <View style={styles.metaRow}>
            <Feather name="slash" size={18} color="white" />
            <Text style={styles.stageText}> MÖBIUS</Text>
          </View>

          <Text style={styles.time}>
            {modalData?.date} {modalData?.start}-{modalData?.end}
          </Text>

          <TouchableOpacity style={styles.heartButton}>
            <Feather name="heart" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modal: {
    margin: scale(10),
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#1a1a24',
    padding: 20,
    height: '65%',
  },
  closeButton: {
    position: 'absolute',
    top: -45,
    right: 15,
    zIndex: 10,
  },

  artistName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stageText: {
    color: '#ffffff',
    fontSize: 16,
  },
  time: {
    color: '#3366ff',
    fontSize: 16,
    marginBottom: 30,
  },
  heartButton: {
    backgroundColor: '#0000ff',
    width: 50,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
