import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {v4 as uuidv4} from 'uuid'; // npm install uuid

// Assume you have a WebSocket client connected, e.g., using Socket.IO
// import io from 'socket.io-client';
// const socket = io('YOUR_BACKEND_URL');

export default function ChatScreen({route}) {
  const {recipientId, conversationId, chatType} = route.params; // chatType: 'one-to-one' or 'group'
  const [messages, setMessages] = useState([]);
  const currentUser = {
    _id: 'user123', // Replace with actual current user ID
    name: 'John Doe',
    avatar: 'https://placeimg.com/140/140/any',
  };

  useEffect(() => {
    // Load initial messages (from backend or local storage)
    // For demonstration, let's add some dummy messages
    setMessages([
      {
        _id: uuidv4(),
        text: 'Hello there!',
        createdAt: new Date(),
        user: {_id: 'otherUser456', name: 'Jane Smith'},
      },
      {
        _id: uuidv4(),
        text: 'Hi!',
        createdAt: new Date(Date.now() - 60 * 1000), // 1 minute ago
        user: currentUser,
      },
    ]);

    // Listen for incoming messages from the backend
    // socket.on('receiveMessage', (message) => {
    //   setMessages((prevMessages) => GiftedChat.append(prevMessages, [message]));
    // });

    // return () => {
    //   socket.off('receiveMessage');
    // };
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));

    newMessages.forEach(message => {
      const messageToSend = {
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt.toISOString(),
        senderId: currentUser._id,
        recipientId: chatType === 'one-to-one' ? recipientId : undefined,
        groupId: chatType === 'group' ? conversationId : undefined,
        status: 'sending', // Custom status for UI
      };

      // Emit message to your backend
      // socket.emit('sendMessage', messageToSend);
      console.log('Sending message:', messageToSend); // Simulate sending

      // In a real app, you'd get a response from the backend
      // and update the message status accordingly.
      // For now, let's simulate a 'sent' status after a delay
      setTimeout(() => {
        setMessages(prevMsgs =>
          prevMsgs.map(msg =>
            msg._id === message._id ? {...msg, status: 'sent'} : msg,
          ),
        );
      }, 500);
    });
  }, []);

  const onLongPressMessage = (context, message) => {
    const options = ['Copy', 'Edit', 'Delete', 'Share', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        buttonIndex => {
          handleMessageAction(options[buttonIndex], message);
        },
      );
    } else {
      Alert.alert(
        'Message Options',
        '',
        options.map(option => ({
          text: option,
          onPress: () => handleMessageAction(option, message),
          style: option === 'Cancel' ? 'cancel' : 'default',
        })),
      );
    }
  };

  const handleMessageAction = (action, message) => {
    switch (action) {
      case 'Copy':
        Clipboard.setString(message.text);
        // Show a toast message "Copied!"
        break;
      case 'Edit':
        // Implement edit logic:
        // 1. Set the message text in the input field
        // 2. Set a state like `editingMessageId` to the message._id
        // 3. Modify `onSend` to handle edits when `editingMessageId` is set
        console.log('Edit message:', message);
        // Example: Set message text to input, assuming you manage input state
        // setInputText(message.text);
        // setEditingMessage(message);
        break;
      case 'Delete':
        Alert.alert(
          'Delete Message',
          'Are you sure you want to delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => {
                // Send delete request to backend
                // socket.emit('deleteMessage', message._id);
                console.log('Deleting message:', message._id);
                // Optimistically remove from UI or mark as deleted
                setMessages(prevMsgs =>
                  prevMsgs.filter(msg => msg._id !== message._id),
                ); // Hard delete for now
                // Or for soft delete:
                // setMessages(prevMsgs => prevMsgs.map(msg =>
                //   msg._id === message._id ? { ...msg, text: 'This message was deleted.', deleted: true } : msg
                // ));
              },
              style: 'destructive',
            },
          ],
        );
        break;
      case 'Share':
        Share.share({
          message: message.text,
          title: 'Share Chat Message',
        })
          .then(result => console.log(result))
          .catch(error => console.error(error));
        break;
      default:
        break;
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      onLongPress={onLongPressMessage}
      user={currentUser}
      renderTicks={message => {
        // Custom rendering for message status (sent, delivered, seen)
        if (message.status === 'sending') {
          return (
            <Text style={{fontSize: 10, color: 'gray', marginHorizontal: 5}}>
              ⌛
            </Text>
          );
        } else if (message.status === 'sent') {
          return (
            <Text style={{fontSize: 10, color: 'gray', marginHorizontal: 5}}>
              ✓
            </Text>
          );
        } else if (message.status === 'delivered') {
          return (
            <Text style={{fontSize: 10, color: 'gray', marginHorizontal: 5}}>
              ✓✓
            </Text>
          );
        } else if (message.status === 'seen') {
          return (
            <Text style={{fontSize: 10, color: 'blue', marginHorizontal: 5}}>
              ✓✓
            </Text>
          );
        }
        return null;
      }}
      // Add other props for attachments, etc.
    />
  );
}
