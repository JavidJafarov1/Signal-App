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
  TextInput,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  AddMember,
  GetAllGroup,
  leaveGroup,
  RemoveMember,
  UpdateGroupDetails,
} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/color/Color';
import Header from '../../../components/Header';
import {scale} from 'react-native-size-matters';
import useAppHooks from '../../../auth/useAppHooks';
import {setGroupDetails} from '../../../store/reducer/userReducer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function GroupInfoScreen({route}) {
  const {navigation, dispatch} = useAppHooks();
  const {groupId} = route.params;
  const [members, setMembers] = useState([]);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupIcone, setGroupIcone] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const token = useAuthToken();
  const userList = useSelector(state => state?.user?.userList || []);
  const groupsFromRedux = useSelector(state => state?.user?.groupList || []);
  const currentUserId = useSelector(state => state?.auth?.userDetails?.id);
  const memberIds = members.map(member => member._id);
  const currentGroup = groupsFromRedux.find(group => group._id === groupId);
  const creatorId = currentGroup?.createdBy?._id;
  const isCreator = creatorId === currentUserId;

  useEffect(() => {
    if (currentGroup) {
      setMembers(currentGroup.members || []);
      setGroupName(currentGroup.name || '');
      setGroupIcone(currentGroup.groupIcone || '');
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
      if (currentGroup) {
        setMembers(currentGroup.members || []);
        setGroupName(currentGroup.name || '');
        setGroupIcone(currentGroup.groupIcone || '');
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
      Alert.alert('Error', 'Could not load group members');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGroupDetails();
    setRefreshing(false);
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
      });
      if (!result.didCancel && result.assets?.length > 0) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || 'groupIcon.png',
          type: asset.type || 'image/png',
        };
        setIconFile(file);
        setGroupIcone(asset.uri);
      }
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpdateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Group name cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const res = await UpdateGroupDetails(groupId, groupName, iconFile, token);
      if (res.success) {
        const updatedGroups = groupsFromRedux.map(group =>
          group._id === groupId
            ? {
                ...group,
                name: res?.group?.name,
                groupIcone: res?.group?.groupIcone,
              }
            : group,
        );
        dispatch(setGroupDetails(updatedGroups));
        setGroupIcone(res?.group?.groupIcone || groupIcone);
        setIconFile(null);
        Alert.alert('Success', 'Group info updated successfully');
        navigation.navigate('ConversationsListScreen', {refresh: true});
      } else {
        Alert.alert('Failed', res?.error || 'Could not update group');
      }
    } catch (error) {
      console.error('Update group error:', error);
      Alert.alert('Error', 'Failed to update group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const res = await leaveGroup(groupId, token);
      if (res.success) {
        Alert.alert('Left Group', 'You have left the group');
        navigation.navigate('ConversationsListScreen', {refresh: true});
      } else {
        Alert.alert('Failed', res?.error || 'Could not leave group');
      }
    } catch (err) {
      console.error('Leave group error:', err);
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
        const updatedGroups = groupsFromRedux.map(group =>
          group._id === groupId
            ? {...group, members: [...group.members, ...newlyAddedUsers]}
            : group,
        );
        dispatch(setGroupDetails(updatedGroups));
        setSelectedUsers([]);
        setSelectModalVisible(false);
        Alert.alert('Success', 'Member added');
      } else {
        Alert.alert('Failed', 'Could not add member(s)', [
          {text: 'OK', onPress: () => setSelectModalVisible(false)},
        ]);
      }
    } catch (err) {
      console.error('Add member error:', err);
      Alert.alert('Error', 'Only creator can add members', [
        {text: 'OK', onPress: () => setSelectModalVisible(false)},
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
                const updatedGroups = groupsFromRedux.map(group =>
                  group._id === groupId
                    ? {
                        ...group,
                        members: group.members.filter(
                          m => m._id !== member._id,
                        ),
                      }
                    : group,
                );
                dispatch(setGroupDetails(updatedGroups));
                Alert.alert('Success', 'Member removed successfully');
              } else {
                Alert.alert('Failed', 'Could not remove member');
              }
            } catch (err) {
              console.error('Remove member error:', err);
              Alert.alert('Error', 'Only creator can remove members');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const AvatarDisplay = ({name, avatar}) => (
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

  const renderMemberItem = ({item}) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => isCreator && handleRemoveMember(item)}>
      <AvatarDisplay
        name={item.firstName || item.fullName}
        avatar={item.avatar}
      />
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

  const renderAddMemberModal = () => (
    <Modal
      visible={selectModalVisible}
      animationType="slide"
      transparent
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

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <Header />
          <ActivityIndicator size="large" color={Color.blue} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header />
        {isCreator && (
          <View style={styles.editContainer}>
            <View style={styles.avatarEditWrapper}>
              <View>
                {groupIcone ? (
                  <Image
                    source={{uri: groupIcone}}
                    style={styles.groupAvatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>+</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={isCreator ? handleImagePick : null}
                style={styles.editButton}>
                <AntDesign name={'edit'} size={16} color={Color.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Group Name</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Enter group name"
              placeholderTextColor="#999"
              editable={isCreator}
            />
          </View>
        )}
        {isCreator && (
          <TouchableOpacity
            onPress={() => setSelectModalVisible(true)}
            style={{
              flexDirection: 'row',
              marginVertical: scale(15),
            }}>
            <View
              style={{
                height: 40,
                width: 40,
                backgroundColor: '#aaa',
                alignSelf: 'center',
                justifyContent: 'center',
                borderRadius: scale(50),
              }}>
              <FontAwesome5
                name="user-plus"
                color={Color?.white}
                style={{alignSelf: 'center', justifyContent: 'center'}}
                size={15}
              />
            </View>
            <View style={styles.addButton}>
              <Text style={styles.addText}>Add Member</Text>
            </View>
          </TouchableOpacity>
        )}
        <FlatList
          data={members}
          keyExtractor={item => item._id}
          renderItem={renderMemberItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          // ListHeaderComponent={
          //   <Text style={styles.title}>Group Members ({members.length})</Text>
          // }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No members found</Text>
          }
        />
        {isCreator && (
          <>
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: '#4caf50',
                borderRadius: scale(8),
              }}
              onPress={handleUpdateGroup}>
              <Text
                style={[
                  styles.addText,
                  {alignSelf: 'center', padding: scale(10)},
                ]}>
                Edit Group Info
              </Text>
            </TouchableOpacity>
          </>
        )}
        {!isCreator && (
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveGroup}>
            <Text style={{color: Color.white}}>Leave Group</Text>
          </TouchableOpacity>
        )}
      </View>
      {renderAddMemberModal()}
    </ScreenWrapper>
  );
}

const uploadImageToServer = async (formData, token) => {
  try {
    const response = await fetch('YOUR_CLOUDINARY_UPLOAD_URL', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Image upload error:', error);
    return {success: false, error: 'Image upload failed'};
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: scale(18),
    color: Color?.white,
    marginBottom: 10,
    fontWeight: '600',
    marginTop: scale(10),
  },
  memberItem: {
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
    left: scale(10),
    alignSelf: 'center',
  },
  addText: {
    color: Color?.white,
    fontSize: scale(18),
    fontWeight: '600',
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
  userItemSelected: {backgroundColor: '#333'},
  disabledUser: {backgroundColor: '#555', opacity: 0.6},
  userText: {color: Color?.white, fontSize: scale(17), marginLeft: 10},
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelText: {color: 'red', fontSize: scale(18), fontWeight: '600'},
  addmemberTxt: {color: '#1e88e5', fontSize: scale(18), fontWeight: '600'},
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  avatarText: {fontSize: 20, fontWeight: 'bold', color: Color?.white},
  avatarImage: {width: 50, height: 50, borderRadius: 25},
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  editContainer: {
    backgroundColor: '#2c2c2c',
    padding: scale(15),
    borderRadius: 10,
  },
  inputLabel: {
    color: Color?.white,
    fontSize: scale(15),
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 10,
    color: Color?.white,
    fontSize: scale(14),
    fontWeight: '600',
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEditWrapper: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'gray',
    padding: scale(7),
    position: 'absolute',
    borderRadius: 20,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
});
