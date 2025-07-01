import React, {useEffect, useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {
  AddMember,
  GetAllGroup,
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
import {setGroupDetails} from '../../../store/reducer/userReducer';

export default function GroupInfoScreen({route}) {
  const {navigation, dispatch} = useAppHooks();
  const {groupId} = route.params;

  const [members, setMembers] = useState([]);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const token = useAuthToken();
  const userList = useSelector(state => state?.user?.userList || []);

  const groupsFromRedux = useSelector(state => state?.user?.groupList || []);

  console.log('groupsFromRedux', groupsFromRedux[0]?.members)

  const memberIds = members.map(member => member._id);
  const currentGroup = groupsFromRedux.find(group => group._id === groupId);
  const creatorId = currentGroup?.createdBy?._id;
  const currentUserId = useSelector(state => state?.auth?.userDetails?.id);
  const isCreator = creatorId === currentUserId;

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGroupDetails(); 
    setRefreshing(false);
  };

  useEffect(() => {
    const currentGroup = groupsFromRedux.find(group => group._id === groupId);
    if (currentGroup?.members) {
      setMembers(currentGroup.members);
    } else {
      fetchGroupDetails();
    }
  }, [groupId, groupsFromRedux]);

  const fetchGroupDetails = async () => {
    setIsLoading(true);
    try {
      const response = await GetAllGroup(token);
      const currentGroup = response?.groups?.find(
        group => group._id === groupId,
      );
      if (currentGroup?.members) {
        setMembers(currentGroup.members);
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
      Alert.alert('Error', 'Could not load group members');
    } finally {
      setIsLoading(false);
    }
  };

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
    if (selectedUsers.length === 0) {
      Alert.alert(
        'No Users Selected',
        'Please select at least one user to add.',
      );
      return;
    }

    try {
      const res = await AddMember(groupId, selectedUsers, token);

      if (res.success) {
        const newlyAddedUsers = userList
          .map(item => item?.participant || item)
          .filter(user => selectedUsers.includes(user._id));

        setMembers(prev => [...prev, ...newlyAddedUsers]);

        const updatedGroupsInRedux = groupsFromRedux.map(group => {
          if (group._id === groupId) {
            return {
              ...group,
              members: [...group.members, ...newlyAddedUsers],
            };
          }
          return group;
        });

        dispatch(setGroupDetails(updatedGroupsInRedux));

        setSelectedUsers([]);
        setSelectModalVisible(false);
        Alert.alert('Success', 'Member added');
      } else {
        Alert.alert('Failed', 'Could not add member(s)', [
          {
            text: 'OK',
            onPress: () => setSelectModalVisible(false),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Only creator can add members', [
        {
          text: 'OK',
          onPress: () => setSelectModalVisible(false),
        },
      ]);
    }
  };

  const handleRemoveMember = member => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${
        member?.firstName || member?.fullName
      } ${member?.lastName || ''}?`,
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

                const updatedGroupsInRedux = groupsFromRedux.map(group => {
                  if (group._id === groupId) {
                    return {
                      ...group,
                      members: group.members.filter(m => m._id !== member._id),
                    };
                  }
                  return group;
                });
                dispatch(setGroupDetails(updatedGroupsInRedux));

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
      <AvatarDisplay
        name={item.firstName || item.fullName}
        avatar={item.avatar}
      />
      {console.log('item', item)}
      <Text style={styles.memberText}>
        {item?.firstName || item?.fullName || 'undefined'}{' '}
        {item?.lastName || ''}
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
          {user?.firstName || user?.fullName || 'undefined'}{' '}
          {user?.lastName || ''}
        </Text>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <Header />
          <ActivityIndicator size="large" color={Color?.blue} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header />
        <FlatList
          data={members}
          keyExtractor={item => item._id}
          renderItem={renderMemberItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={
            <Text style={styles.title}>Group Members ({members.length})</Text>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No members found</Text>
          }
        />

        {isCreator && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setSelectModalVisible(true)}>
            <Text style={styles.addText}>Add Member</Text>
          </TouchableOpacity>
        )}
        {!isCreator && (
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveGroup}>
            <Text style={{color: Color?.white}}>Leave Group</Text>
          </TouchableOpacity>
        )}
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
              keyExtractor={item => item._id || item.id}
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
  container: {
    flex: 1,
  },
  title: {
    fontSize: scale(18),
    color: Color?.white,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  memberItem: {
    paddingVertical: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    color: Color?.white,
    fontSize: scale(17),
    marginLeft: scale(10),
    fontWeight: '600',
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
    fontSize: scale(18),
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
    fontSize: scale(17),
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelText: {
    color: 'red',
    fontSize: scale(18),
    fontWeight: '600',
  },
  addmemberTxt: {
    color: '#1e88e5',
    fontSize: scale(18),
    fontWeight: '600',
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
    color: Color?.white,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
