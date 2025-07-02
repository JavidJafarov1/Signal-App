import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/color/Color';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/Header';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CreateNewGroupScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const navigation = useNavigation();
  const userData = useSelector(state => state?.user?.userList);

  const toggleMemberSelection = userId => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId],
    );
  };

  const getSelectedUserDetails = () =>
    userData?.filter(user => selectedMembers.includes(user?.participant?._id));

  const filteredUsers = userData?.filter(user =>
    user?.participant?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const renderUserItem = ({item}) => {
    const isSelected = selectedMembers.includes(item?.participant._id);
    const avatarUrl = item?.participant?.avatar;

    return (
      <TouchableOpacity
        style={[styles.conversationItem, isSelected && styles.selectedItem]}
        onPress={() => toggleMemberSelection(item?.participant._id)}>
        <View style={styles.avatarPlaceholder}>
          {avatarUrl ? (
            <Image source={{uri: avatarUrl}} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {item?.participant?.fullName?.charAt(0).toUpperCase() || '?'}
            </Text>
          )}
        </View>
        <Text style={styles.conversationName}>
          {item?.participant.fullName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSelectedUser = ({item}) => {
    const avatarUrl = item?.participant?.avatar;
    return (
      <View style={styles.selectedMemberContainer}>
        {avatarUrl ? (
          <Image source={{uri: avatarUrl}} style={styles.selectedAvatar} />
        ) : (
          <View style={styles.fallbackAvatar}>
            <Text style={styles.avatarText}>
              {item?.participant?.fullName?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <Text style={styles.selectedName} numberOfLines={1}>
          {item?.participant?.fullName?.split(' ')[0]}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 5,
            position: 'absolute',
            bottom: 5,
            right: 5,
            borderRadius: scale(50),
          }}
          onPress={() => toggleMemberSelection(item?.participant._id)}>
          <AntDesign name={'close'} color={Color?.white} size={16} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleNext = () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member');
      return;
    }

    navigation.navigate('EnterGroupNameScreen', {
      selectedMembers,
    });
  };

  return (
    <ScreenWrapper>
      <View style={{flex: 1}}>
        <Header />

        <TextInput
          placeholder="Search users..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Color.white}
        />

        <Text style={styles.sectionTitle}>Add Members</Text>

        {selectedMembers.length > 0 && (
          <FlatList
            data={getSelectedUserDetails()}
            keyExtractor={item => item?.participant?._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedList}
            renderItem={renderSelectedUser}
          />
        )}

        <Text style={styles.sectionTitle}>All Contacts</Text>

        <FlatList
          data={filteredUsers}
          keyExtractor={item => item?._id || item?.participant?._id}
          renderItem={renderUserItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found.</Text>
          }
          contentContainerStyle={{paddingBottom: 10}}
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default CreateNewGroupScreen;

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: Color.white,
    padding: scale(10),
    fontWeight: '600',
    fontSize: 18,
    marginTop: scale(10),
  },
  sectionTitle: {
    color: Color.lightGray,
    fontSize: scale(16),
    fontWeight: '600',
    marginTop: scale(12),
    marginBottom: scale(6),
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    marginBottom: scale(4),
  },
  selectedItem: {
    backgroundColor: Color.blue,
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#b0bec5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  fallbackAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.white,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: Color.white,
  },
  selectedList: {
    paddingVertical: scale(5),
    paddingLeft: scale(5),
  },
  selectedMemberContainer: {
    alignItems: 'center',
    marginRight: scale(10),
    width: scale(60),
  },
  selectedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: scale(4),
  },
  selectedName: {
    color: Color.white,
    fontSize: scale(12),
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: Color.blue,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: Color.white,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: scale(18),
  },
});
