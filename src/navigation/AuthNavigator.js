import React from 'react'
import LoginScreen from '../screens/LoginScreen'
import HomeScreen from '../screens/HomeScreen'
import HomeDetailsScreen from '../screens/HomeDetailsScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen'
import ArtistsScreen from '../screens/ArtistsScreen'
import TimelineScreen from '../screens/TimelineScreen'
import ProgramScreen from '../screens/ProgramScreen'
import SignalLiveScreen from '../screens/SignalLiveScreen'
import PartnersScreen from '../screens/PartnersScreen'
import MapScreen from '../screens/MapScreen'
import ProgramDetailsScreen from '../screens/ProgramDetailsScreen'
import WelcomeScreen from '../screens/WelcomeScreen'

const Stack = createNativeStackNavigator()

export const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
    )
}

export const UserStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="HomeDetailsScreen" component={HomeDetailsScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="ArtistsScreen" component={ArtistsScreen} />
            <Stack.Screen name="TimelineScreen" component={TimelineScreen} />
            <Stack.Screen name="ProgramScreen" component={ProgramScreen} />
            <Stack.Screen name="ProgramDetailsScreen" component={ProgramDetailsScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="SignalLiveScreen" component={SignalLiveScreen} />
            <Stack.Screen name="PartnersScreen" component={PartnersScreen} />
        </Stack.Navigator>
    )
}
