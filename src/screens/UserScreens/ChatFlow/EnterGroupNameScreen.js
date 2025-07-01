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
import { useRoute} from '@react-navigation/native';
import useAppHooks from '../../../auth/useAppHooks';
import Header from '../../../components/Header';
import {scale} from 'react-native-size-matters';

const EnterGroupNameScreen = () => {
  const [groupName, setGroupName] = useState('');
  const token = useAuthToken();
  const {navigation, t, dispatch} = useAppHooks();

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
      navigation.navigate('ConversationsListScreen');
    } catch (error) {
      console.error('Group creation error:', error);
      Alert.alert('Error', 'Failed to create group.');
    }
  };

  return (
    <ScreenWrapper>
      <View style={{}}>
        <Header />
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    color: Color.white,
    padding: scale(10),
    fontSize: scale(15),
    fontWeight: '600',
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
    fontSize: scale(15),
  },
});
