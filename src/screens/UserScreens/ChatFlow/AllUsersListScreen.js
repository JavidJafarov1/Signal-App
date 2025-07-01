import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {initiateSocket, disconnectSocket} from '../../../utils/socket';
import {useAuthToken} from '../../../utils/api';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/color/Color';
import Header from '../../../components/Header';
import useAppHooks from '../../../auth/useAppHooks';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {scale, verticalScale} from 'react-native-size-matters';

export default function ConversationsListScreen() {
  const {navigation} = useAppHooks();
  const token = useAuthToken();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  const SENDER = useSelector(state => state?.auth?.userDetails);
  const userList = useSelector(state => state?.user?.userList);

  useEffect(() => {
    if (SENDER?.id) {
      initiateSocket(SENDER.id);
    }
    return () => disconnectSocket();
  }, [SENDER?.id]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredList(userList || []);
    } else {
      const filtered = (userList || []).filter(item =>
        item?.participant?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
      setFilteredList(filtered);
    }
  }, [searchQuery, userList]);

  const handleSearch = text => {
    setSearchQuery(text);
  };

  const renderConversation = ({item}) => {
    const avatarUrl = item?.participant?.avatar;

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            user: item.participant,
            senderId: item.id
              .split('_')
              .find(id => id !== item.participant._id),
          })
        }>
        <View style={styles.avatarPlaceholder}>
          {avatarUrl ? (
            <Image source={{uri: avatarUrl}} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {item?.participant?.fullName?.charAt(0).toUpperCase() || '?'}
            </Text>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.conversationName}>
            {item.participant?.fullName}
          </Text>
          <Text style={styles.lastMessage}>Start chatting!</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <Header />
      <View style={styles.container}>
        <TextInput
          placeholder="Search users..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={Color.white}
        />

        <TouchableOpacity
          style={styles.newGroupBtn}
          onPress={() => navigation.navigate('CreateNewGroupScreen')}>
          <View
            style={{
              backgroundColor: Color?.white,
              padding: 5,
              borderRadius: 30,
            }}>
            <MaterialIcons name="group" size={22} color={Color.black} />
          </View>
          <Text style={styles.newGroupText}>New Group</Text>
        </TouchableOpacity>
        <Text style={styles.contactTxt}>All Contacts</Text>
        <FlatList
          data={filteredList}
          keyExtractor={item => item.id}
          renderItem={renderConversation}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found.</Text>
          }
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  searchInput: {
    borderWidth: 1,
    borderColor: Color.white,
    borderRadius: 8,
    color: Color.white,
    padding: scale(10),
    fontSize: 18,
    fontWeight: '600',
  },
  newGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(15),
  },
  newGroupText: {
    color: Color.white,
    fontSize: scale(18),
    marginLeft: 10,
    fontWeight: '600',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.white,
  },
  lastMessage: {
    fontSize: 14,
    color: Color.white,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: Color.white,
  },
  contactTxt: {
    color: Color?.lightGray,
    fontSize: scale(18),
    fontWeight: '600',
    marginTop: scale(10),
  },
});
