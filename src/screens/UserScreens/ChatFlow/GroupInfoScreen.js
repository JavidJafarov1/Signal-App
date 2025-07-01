import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import {
  AddMember,
  leaveGroup,
  RemoveMember,
} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/color/Color';
import Header from '../../../components/Header';
import {scale} from 'react-native-size-matters';
import useAppHooks from '../../../auth/useAppHooks';

export default function GroupInfoScreen({route}) {
  const {navigation} = useAppHooks();
  const {groupId, members: initialMembers = []} = route.params;

  const [members, setMembers] = useState(initialMembers?.members || []);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const token = useAuthToken();
  const userList = useSelector(state => state?.user?.userList || []);
  const memberIds = members.map(member => member._id);

  function AvatarDisplay({name, avatar}) {
    return (
      <View style={styles.avatarPlaceholder}>
        {avatar ? (
          <Image source={{uri: avatar}} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>
            {name?.charAt(0).toUpperCase() || '?'}
          </Text>
        )}
      </View>
    );
  }

  const handleLeaveGroup = async () => {
    try {
      const res = await leaveGroup(groupId, token);
      if (res.success) {
        Alert.alert('Left Group', 'You have left the group');
        navigation.goBack();
      } else {
        Alert.alert('Failed', res?.error || 'Could not leave group');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Group creator cannot leave the group');
    }
  };

  const handleAddMember = async () => {
    try {
      const res = await AddMember(groupId, selectedUsers, token);
      if (res.success) {
        const newlyAddedUsers = userList
          .map(item => item?.participant || item)
          .filter(user => selectedUsers.includes(user._id));

        setMembers(prev => [...prev, ...newlyAddedUsers]);
        setSelectedUsers([]);
        setSelectModalVisible(false);
        Alert.alert('Success', 'Member added');
      } else {
        Alert.alert('Failed', 'Could not add member(s)');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Only creator can add members');
    }
  };

  const handleRemoveMember = member => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member?.firstName} ${member?.lastName}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await RemoveMember(groupId, member._id, token);
              if (res.success) {
                setMembers(prev => prev.filter(m => m._id !== member._id));
                Alert.alert('Removed', 'Member removed successfully');
              } else {
                Alert.alert('Failed', 'Could not remove member');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Only creator can remove members');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const renderMemberItem = ({item}) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => handleRemoveMember(item)}>
      <AvatarDisplay name={item.firstName} avatar={item.avatar} />
      <Text style={styles.memberText}>
        {item?.firstName || 'undefined'} {item?.lastName || 'undefined'}
      </Text>
    </TouchableOpacity>
  );

  const renderUserItem = ({item}) => {
    const user = item?.participant || item;
    const userId = user?._id;
    const isAlreadyMember = memberIds.includes(userId);
    const isSelected = selectedUsers.includes(userId);
    const toggleSelect = () => {
      if (isAlreadyMember) return;
      setSelectedUsers(prev =>
        isSelected ? prev.filter(id => id !== userId) : [...prev, userId],
      );
    };

    return (
      <Pressable
        disabled={isAlreadyMember}
        onPress={toggleSelect}
        style={[
          styles.userItem,
          isAlreadyMember && styles.disabledUser,
          isSelected && styles.userItemSelected,
        ]}>
        <AvatarDisplay name={user?.fullName} avatar={user?.avatar} />
        <Text style={styles.userText}>
          {user?.firstName || 'undefined'} {user?.lastName || 'undefined'}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header />
        <FlatList
          data={members}
          keyExtractor={item => item._id}
          renderItem={renderMemberItem}
          ListHeaderComponent={
            <Text style={styles.title}>No Group Members</Text>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setSelectModalVisible(true)}>
          <Text style={styles.addText}>Add Member</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
          <Text style={{color: Color?.white}}>Leave Group</Text>
        </TouchableOpacity>
      </View>

      {renderAddMemberModal()}
    </ScreenWrapper>
  );

  function renderAddMemberModal() {
    return (
      <Modal
        visible={selectModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Users to Add</Text>
            <FlatList
              data={userList}
              keyExtractor={item => item._id}
              renderItem={renderUserItem}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setSelectModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddMember}>
                <Text style={styles.addmemberTxt}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  memberItem: {
    paddingVertical: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: scale(10),
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userItemSelected: {
    backgroundColor: '#333',
  },
  disabledUser: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  userText: {
    color: Color?.white,
    fontSize: 15,
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
  },
  addmemberTxt: {
    color: '#1e88e5',
    fontSize: 16,
    fontWeight: 'bold',
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
});
