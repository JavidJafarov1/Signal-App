import HomeScreen from '../screens/UserScreens/HomeScreen';
import HomeDetailsScreen from '../screens/UserScreens/HomeDetailsScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from '../screens/UserScreens/ProfileScreen';
import TimelineScreen from '../screens/UserScreens/TimelineScreen';
import ProgramScreen from '../screens/UserScreens/ProgramScreen';
import SignalLiveScreen from '../screens/UserScreens/SignalLiveScreen';
import PartnersScreen from '../screens/UserScreens/PartnersScreen';
import MapScreen from '../screens/UserScreens/MapScreen';
import ProgramDetailsScreen from '../screens/UserScreens/ProgramDetailsScreen';
import ConversationsListScreen from '../screens/UserScreens/ChatFlow/ConversationsListScreen';
import ChatScreen from '../screens/UserScreens/ChatFlow/ChatScreen';
import AllUsersListScreen from '../screens/UserScreens/ChatFlow/AllUsersListScreen';
import CreateNewGroupScreen from '../screens/UserScreens/ChatFlow/CreateNewGroupScreen';
import EnterGroupNameScreen from '../screens/UserScreens/ChatFlow/EnterGroupNameScreen';
import GroupInfoScreen from '../screens/UserScreens/ChatFlow/GroupInfoScreen';

const Stack = createNativeStackNavigator();

export const UserStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="HomeDetailsScreen" component={HomeDetailsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="TimelineScreen" component={TimelineScreen} />
      <Stack.Screen name="ProgramScreen" component={ProgramScreen} />
      <Stack.Screen
        name="ProgramDetailsScreen"
        component={ProgramDetailsScreen}
      />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="SignalLiveScreen" component={SignalLiveScreen} />
      <Stack.Screen name="PartnersScreen" component={PartnersScreen} />
      <Stack.Screen
        name="ConversationsListScreen"
        component={ConversationsListScreen}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="AllUsersListScreen" component={AllUsersListScreen} />
      <Stack.Screen
        name="CreateNewGroupScreen"
        component={CreateNewGroupScreen}
      />
      <Stack.Screen
        name="EnterGroupNameScreen"
        component={EnterGroupNameScreen}
      />
      <Stack.Screen name="GroupInfoScreen" component={GroupInfoScreen} />
    </Stack.Navigator>
  );
};
