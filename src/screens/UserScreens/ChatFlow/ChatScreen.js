// import React, {useEffect, useState, useCallback} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import {
//   sendMessage,
//   editMessage,
//   deleteMessage,
//   initiateSocket,
//   markAsRead,
//   subscribeToPrivateMessages,
//   subscribeToReadStatus,
// } from '../../../utils/socket';
// import ScreenWrapper from '../../../components/ScreenWrapper';
// import {ChatHistory} from '../../../utils/Apis/UsersList';
// import {useAuthToken} from '../../../utils/api';
// import ChatHeader from '../../../components/ChatHeader';

// export default function ChatScreen({route}) {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [editingMessageId, setEditingMessageId] = useState(null);

//   const {user} = route.params || {};
//   const RECEIVER_ID = user?._id;
//   const token = useAuthToken();

//   const formatMessage = msg => ({
//     _id: msg._id,
//     chatType: msg.chatType,
//     receiverId: msg.receiver,
//     content: msg.content,
//     from: msg.sender === RECEIVER_ID ? 'them' : 'me',
//     read: msg.read ?? false,
//     timestamp: msg.timestamp || new Date().toISOString(),
//   });

//   const fetchChatHistory = useCallback(async () => {
//     try {
//       const res = await ChatHistory(RECEIVER_ID, token);
//       if (res?.messages) {
//         const formatted = res.messages.map(formatMessage);
//         setMessages(formatted);
//       }
//     } catch (err) {
//       console.error('Failed to load history:', err);
//     }
//   }, [RECEIVER_ID, token]);

//   const handleSend = useCallback(() => {
//     const trimmed = message.trim();
//     if (!trimmed) return;

//     if (editingMessageId) {
//       editMessage({messageId: editingMessageId, content: trimmed});
//       setMessages(prev =>
//         prev.map(m =>
//           m._id === editingMessageId ? {...m, content: trimmed} : m,
//         ),
//       );
//       setEditingMessageId(null);
//     } else {
//       const tempId = Date.now().toString();
//       const newMsg = {
//         _id: tempId,
//         chatType: 'private',
//         receiverId: RECEIVER_ID,
//         content: trimmed,
//         from: 'me',
//         read: false,
//         timestamp: new Date().toISOString(),
//       };

//       setMessages(prev => [...prev, newMsg]);

//       sendMessage(newMsg, res => {
//         if (res?.success && res.messageId) {
//           setMessages(prev =>
//             prev.map(m => (m._id === tempId ? {...m, _id: res.messageId} : m)),
//           );
//         }
//       });
//     }

//     setMessage('');
//   }, [message, RECEIVER_ID, editingMessageId]);

//   const handleDelete = useCallback(messageId => {
//     deleteMessage(messageId);
//     setMessages(prev => prev.filter(m => m._id !== messageId));
//   }, []);

//   const showOptions = useCallback(
//     item => {
//       Alert.alert('Message Options', '', [

//         {
//           text: 'Edit',
//           onPress: () => {
//             setEditingMessageId(item._id);
//             setMessage(item.content);
//           },
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => handleDelete(item._id),
//         },
//         {text: 'Cancel', style: 'cancel'},
//       ]);
//     },
//     [handleDelete],
//   );

//   const markUnreadMessages = useCallback(() => {
//     messages.forEach(msg => {
//       if (msg.from === 'them' && !msg.read) {
//         markAsRead(msg._id);
//         setMessages(prev =>
//           prev.map(m => (m._id === msg._id ? {...m, read: true} : m)),
//         );
//       }
//     });
//   }, [messages]);

//   useEffect(() => {
//     fetchChatHistory();

//     const msgSub = subscribeToPrivateMessages(newMsg => {
//       if (newMsg.receiverId === RECEIVER_ID || newMsg.sender === RECEIVER_ID) {
//         const formatted = formatMessage(newMsg);
//         setMessages(prev => [...prev, formatted]);

//         if (formatted.from === 'them' && !formatted.read) {
//           markAsRead(formatted._id);
//           setMessages(prev =>
//             prev.map(m => (m._id === formatted._id ? {...m, read: true} : m)),
//           );
//         }
//       }
//     });

//     const readSub = subscribeToReadStatus(({messageId}) => {
//       setMessages(prev =>
//         prev.map(m => (m._id === messageId ? {...m, read: true} : m)),
//       );
//     });

//     markUnreadMessages();

//     return () => {
//       msgSub?.off?.('message');
//       readSub?.off?.('messageRead');
//     };
//   }, [fetchChatHistory, RECEIVER_ID, markUnreadMessages]);

//   const renderItem = useCallback(
//     ({item}) => (
//       <TouchableOpacity onLongPress={() => showOptions(item)}>
//         <View
//           style={[
//             styles.messageBubble,
//             item.from === 'me' ? styles.myMessage : styles.theirMessage,
//           ]}>
//           <Text style={styles.messageText}>{item.content}</Text>
//           <View style={styles.metaContainer}>
//             <Text style={styles.timestamp}>
//               {new Date(item.timestamp).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </Text>
//             {item.from === 'me' && (
//               <Text style={styles.readStatus}>{item.read ? '✓✓' : '✓'}</Text>
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     ),
//     [showOptions],
//   );

//   return (
//     <ScreenWrapper>
//       <ChatHeader userName={user?.fullName} avatar={user?.avatar} />
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <FlatList
//           data={messages}
//           keyExtractor={item => item._id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.messagesContainer}
//         />
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             value={message}
//             onChangeText={setMessage}
//             placeholder={
//               editingMessageId ? 'Edit your message...' : 'Type your message...'
//             }
//             placeholderTextColor="#aaa"
//           />
//           <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
//             <Text style={styles.sendText}>
//               {editingMessageId ? 'Update' : 'Send'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </ScreenWrapper>
//   );
// }

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   messagesContainer: {
//     padding: 10,
//     flexGrow: 1,
//     justifyContent: 'flex-end',
//   },
//   messageBubble: {
//     maxWidth: '75%',
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 10,
//   },
//   myMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#1e88e5',
//   },
//   theirMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#424242',
//   },
//   messageText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   metaContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 5,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: '#aaa',
//   },
//   readStatus: {
//     fontSize: 12,
//     color: '#aaa',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#1c1c1c',
//     borderTopWidth: 1,
//     borderTopColor: '#333',
//     alignItems: 'center',
//   },
//   input: {
//     flex: 1,
//     color: 'white',
//     fontSize: 16,
//     backgroundColor: '#2a2a2a',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
//   sendButton: {
//     marginLeft: 10,
//     backgroundColor: '#1e88e5',
//     borderRadius: 20,
//     justifyContent: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
//   sendText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  sendMessage,
  editMessage,
  deleteMessage,
  initiateSocket,
  markAsRead,
  subscribeToPrivateMessages,
  subscribeToReadStatus,
} from '../../../utils/socket';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {ChatHistory} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import ChatHeader from '../../../components/ChatHeader';

export default function ChatScreen({route}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);

  const {user} = route.params || {};
  const RECEIVER_ID = user?._id;
  const token = useAuthToken();

  const formatMessage = msg => ({
    _id: msg._id,
    chatType: msg.chatType,
    receiverId: msg.receiver,
    content: msg.content,
    from: msg.sender === RECEIVER_ID ? 'them' : 'me',
    read: msg.read ?? false,
    timestamp: msg.timestamp || new Date().toISOString(),
  });

  const fetchChatHistory = useCallback(async () => {
    try {
      const res = await ChatHistory(RECEIVER_ID, token);
      if (res?.messages) {
        const formatted = res.messages.map(formatMessage);
        setMessages(formatted);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, [RECEIVER_ID, token]);

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;

    if (editingMessageId) {
      const targetMessage = messages.find(m => m._id === editingMessageId);
      if (!targetMessage || targetMessage.from !== 'me') {
        Alert.alert('You can only edit your own messages.');
        return;
      }

      editMessage({messageId: editingMessageId, content: trimmed});
      setMessages(prev =>
        prev.map(m =>
          m._id === editingMessageId ? {...m, content: trimmed} : m,
        ),
      );
      setEditingMessageId(null);
    } else {
      const tempId = Date.now().toString();
      const newMsg = {
        _id: tempId,
        chatType: 'private',
        receiverId: RECEIVER_ID,
        content: trimmed,
        from: 'me',
        read: false,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newMsg]);

      sendMessage(newMsg, res => {
        if (res?.success && res.messageId) {
          setMessages(prev =>
            prev.map(m => (m._id === tempId ? {...m, _id: res.messageId} : m)),
          );
        }
      });
    }

    setMessage('');
  }, [message, RECEIVER_ID, editingMessageId, messages]);
  const handleDelete = useCallback(item => {
    if (item.from === 'me') {
      // Delete from both server and UI
      deleteMessage(item._id);
    }

    // In all cases, remove from local UI
    setMessages(prev => prev.filter(m => m._id !== item._id));
  }, []);

  const showOptions = useCallback(
    item => {
      const options = [];

      // Only show Edit option if the message is sent by me
      if (item.from === 'me') {
        options.push({
          text: 'Edit',
          onPress: () => {
            setEditingMessageId(item._id);
            setMessage(item.content);
          },
        });
        options.push({
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(item),
        });

        options.push({text: 'Cancel', style: 'cancel'});

        Alert.alert('Message Options', '', options);
      }
    },
    [handleDelete],
  );

  const markUnreadMessages = useCallback(() => {
    messages.forEach(msg => {
      if (msg.from === 'them' && !msg.read) {
        markAsRead(msg._id);
        setMessages(prev =>
          prev.map(m => (m._id === msg._id ? {...m, read: true} : m)),
        );
      }
    });
  }, [messages]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);
  console.log('messages', messages);

  useEffect(() => {
    const msgSub = subscribeToPrivateMessages(newMsg => {
      if (newMsg.receiverId === RECEIVER_ID || newMsg.sender === RECEIVER_ID) {
        const formatted = formatMessage(newMsg);
        setMessages(prev => [...prev, formatted]);

        if (formatted.from === 'them' && !formatted.read) {
          markAsRead(formatted._id);
          setMessages(prev =>
            prev.map(m => (m._id === formatted._id ? {...m, read: true} : m)),
          );
        }
      }
    });

    const readSub = subscribeToReadStatus(({messageId}) => {
      setMessages(prev =>
        prev.map(m => (m._id === messageId ? {...m, read: true} : m)),
      );
    });

    markUnreadMessages();

    return () => {
      msgSub?.off?.('message');
      readSub?.off?.('messageRead');
    };
  }, [RECEIVER_ID, markUnreadMessages]);

  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity onLongPress={() => showOptions(item)}>
        <View
          style={[
            styles.messageBubble,
            item.from === 'me' ? styles.myMessage : styles.theirMessage,
          ]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <View style={styles.metaContainer}>
            {/* <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text> */}
            {item.from === 'me' && (
              <Text style={styles.readStatus}>{item.read ? '✓✓' : '✓'}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [showOptions],
  );

  return (
    <ScreenWrapper>
      <ChatHeader userName={user?.fullName} avatar={user?.avatar} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={
              editingMessageId ? 'Edit your message...' : 'Type your message...'
            }
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>
              {editingMessageId ? 'Update' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e88e5',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#424242',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#aaa',
  },
  readStatus: {
    fontSize: 12,
    color: '#aaa',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1c1c1c',
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#1e88e5',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
