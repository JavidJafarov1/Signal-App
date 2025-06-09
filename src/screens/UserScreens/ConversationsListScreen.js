import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // npm install @react-navigation/native @react-navigation/native-stack

export default function ConversationsListScreen() {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Fetch conversations from backend or local storage
    setConversations([
      {
        id: 'chat_user_1_user_2',
        type: 'one-to-one',
        participant: {
          _id: 'otherUser456',
          name: 'Jane Smith',
          avatar: 'https://placeimg.com/140/140/people',
        },
        lastMessage: 'Hey, how are you?',
        unreadCount: 1,
        timestamp: new Date(),
      },
      {
        id: 'group_design_team',
        type: 'group',
        name: 'Design Team',
        participants: [
          {_id: 'user123', name: 'John Doe'},
          {_id: 'user789', name: 'Alice Brown'},
        ],
        lastMessage: "Let's discuss the new UI.",
        unreadCount: 0,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      },
    ]);
  }, []);

  const renderConversationItem = ({item}) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        navigation.navigate('ChatScreen', {
          conversationId: item.id,
          recipientId:
            item.type === 'one-to-one' ? item.participant._id : undefined,
          groupId: item.type === 'group' ? item.id : undefined,
          chatType: item.type,
          chatTitle:
            item.type === 'one-to-one' ? item.participant.name : item.name,
        });
      }}>
      <View style={styles.avatarPlaceholder}>
        {/* Render avatar or group icon here */}
        <Text style={styles.avatarText}>
          {item.type === 'one-to-one' ? item.participant.name.charAt(0) : 'G'}
        </Text>
      </View>
      <View style={styles.conversationContent}>
        <Text style={styles.conversationName}>
          {item.type === 'one-to-one' ? item.participant.name : item.name}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={renderConversationItem}
      />
      {/* Button to create new chat */}
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={() => navigation.navigate('NewChatScreen')} // Screen to select users/create group
      >
        <Text style={styles.newChatButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  conversationContent: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray',
  },
  unreadBadge: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 10,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newChatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  newChatButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
