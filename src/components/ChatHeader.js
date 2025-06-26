import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {Color} from '../assets/color/Color';

const ChatHeader = React.memo(({userName, avatar}) => {
  const navigation = useNavigation();
  const hasAvatar = typeof avatar === 'string' && avatar.startsWith('http');

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <Feather name="chevron-left" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        {hasAvatar ? (
          <Image source={{uri: avatar}} style={styles.avatarImage} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.placeholderText}>
              {userName?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.userName}>{userName}</Text>
      </View>
    </View>
  );
});

export default ChatHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    alignSelf: 'center',
  },
  avatarContainer: {
    marginLeft: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  nameContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  userName: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
