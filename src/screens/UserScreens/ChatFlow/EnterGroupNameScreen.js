import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {useAuthToken} from '../../../utils/api';
import {Color} from '../../../assets/color/Color';
import {NewGroup} from '../../../utils/Apis/UsersList';
import {useNavigation, useRoute} from '@react-navigation/native';

const EnterGroupNameScreen = () => {
  const [groupName, setGroupName] = useState('');
  const token = useAuthToken();
  const navigation = useNavigation();
  const route = useRoute();
  const {selectedMembers} = route.params;

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Missing Info', 'Please enter a group name.');
      return;
    }

    try {
      const response = await NewGroup(groupName, selectedMembers, token);
      Alert.alert('Success', 'Group created successfully!');
      // navigation.navigate('ChatScreen', { groupId: response.group._id });
      navigation.navigate('ConversationsListScreen');
    } catch (error) {
      console.error('Group creation error:', error);
      Alert.alert('Error', 'Failed to create group.');
    }
  };

  return (
    <ScreenWrapper>
      <View style={{padding: 20}}>
        <TextInput
          placeholder="Enter group name"
          value={groupName}
          onChangeText={setGroupName}
          placeholderTextColor={Color.white}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
          <Text style={styles.buttonText}>Create Group</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default EnterGroupNameScreen;

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: Color.white,
  },
  button: {
    backgroundColor: Color?.blue,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});
