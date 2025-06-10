import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Color} from '../assets/color/Color';

const {width} = Dimensions.get('window');

const CustomAlertModal = ({
  visible,
  type = 'error',
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
}) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <AntDesign name="checkcircle" size={scale(50)} color="#4CAF50" />
          ),
          color: '#4CAF50',
          bgColor: '#E8F5E8',
        };
      case 'warning':
        return {
          icon: <Icon name="warning" size={scale(50)} color="#FF9800" />,
          color: '#FF9800',
          bgColor: '#FFF3E0',
        };
      case 'error':
      default:
        return {
          icon: (
            <Entypo name="circle-with-cross" size={scale(50)} color="#F44336" />
          ),
          color: '#F44336',
          bgColor: '#FFEBEE',
        };
    }
  };

  const {icon, color, bgColor} = getIconAndColor();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, {backgroundColor: bgColor}]}>
          <View style={styles.iconContainer}>{icon}</View>

          {title && <Text style={[styles.title, {color}]}>{title}</Text>}

          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                {backgroundColor: color},
                showCancel && styles.buttonWithMargin,
              ]}
              onPress={onConfirm || onClose}>
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    borderRadius: scale(15),
    padding: scale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: verticalScale(15),
  },
  title: {
    fontSize: scale(20),
    fontWeight: '700',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  message: {
    fontSize: scale(16),
    color: Color.text,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    lineHeight: scale(22),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWithMargin: {
    marginLeft: scale(10),
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Color.text,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: '600',
  },
  cancelButtonText: {
    color: Color.text,
    fontSize: scale(16),
    fontWeight: '600',
  },
});

export default CustomAlertModal;
