import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/color/Color';

const LoadingOverlay = ({
  visible = false,
  text = 'Loading...',
  backgroundColor = 'rgba(0, 0, 0, 0.7)',
  spinnerColor = Color.white,
  spinnerSize = 'large',
  containerStyle = {},
  textStyle = {},
  showText = true,
  onRequestClose = null,
  dismissible = false,
}) => {
  const handleBackdropPress = () => {
    if (dismissible && onRequestClose) {
      onRequestClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={dismissible ? onRequestClose : undefined}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={[styles.overlay, {backgroundColor}]}>
          <TouchableWithoutFeedback>
            <View style={[styles.container, containerStyle]}>
              <ActivityIndicator size={spinnerSize} color={spinnerColor} />
              {showText && <Text style={[styles.text, textStyle]}>{text}</Text>}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Color.backgroundColor,
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(30),
    borderRadius: scale(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: scale(120),
  },
  text: {
    color: Color.text,
    fontSize: scale(16),
    marginTop: verticalScale(10),
    fontWeight: '500',
    textAlign: 'center',
  },
});
