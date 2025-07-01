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
        style={[
          styles.conversationItem,
          isSelected && {backgroundColor: Color?.blue},
        ]}
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
        <View style={styles.textContainer}>
          <Text style={styles.conversationName}>
            {item?.participant.fullName}
          </Text>
        </View>
      </TouchableOpacity>
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
        <Text style={styles.contactTxt}>All Contacts</Text>

        <View style={{flex: 1}}>
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item?._id || item?.participant?._id}
            renderItem={renderUserItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No users found.</Text>
            }
          />
        </View>

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
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderRadius: 8,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#b0bec5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263238',
  },
  textContainer: {flex: 1},
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
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nextButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contactTxt: {
    color: Color?.lightGray,
    fontSize: scale(18),
    fontWeight: '600',
    marginTop: scale(15),
  },
});
