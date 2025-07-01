import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {Color} from '../assets/color/Color';

const ChatHeader = React.memo(({userName, avatar, onMenuPress, menu}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const hasAvatar = typeof avatar === 'string' && avatar.startsWith('http');

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <Feather name="chevron-left" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        {hasAvatar && !loadFailed ? (
          <>
            <Image
              source={{uri: avatar}}
              style={styles.avatarImage}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setLoadFailed(true);
              }}
            />
            {loading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="small" color={Color?.blue} />
              </View>
            )}
          </>
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

      {menu && (
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Feather name="more-vertical" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
});

export default ChatHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {},
  avatarContainer: {
    marginLeft: 5,
    position: 'relative',
    width: 40,
    height: 40,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color?.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  userName: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuButton: {
    paddingHorizontal: 5,
  },
});
