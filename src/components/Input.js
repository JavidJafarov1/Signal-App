import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Color} from '../assets/color/Color';
import {scale} from 'react-native-size-matters';

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  secure = false,
  icon = null,
  keyboardType = 'default',
  isSearch = false,
  style,
  maxLength,
}) => {
  const [showPassword, setShowPassword] = useState(!secure);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputWrapper}>
        {isSearch && (
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.leftIcon}
          />
        )}

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          keyboardType={keyboardType}
          placeholderTextColor={Color.text}
          maxLength={maxLength}
          style={[
            styles.input,
            isSearch && {paddingLeft: 30},
            icon && {paddingRight: 40},
          ]}
        />

        {secure && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.gray,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Color.text,
    height: scale(46),
    backgroundColor: Color.gray,
  },
  leftIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
});

export default CustomTextInput;
