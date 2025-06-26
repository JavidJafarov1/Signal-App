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
      <View style={{flex: 1, padding: 15}}>
        <TextInput
          placeholder="Search users..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Color.white}
        />

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
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: Color.white,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.8,
    borderBottomColor: '#eee',
    borderRadius: 8,
    marginBottom: 5,
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
});
