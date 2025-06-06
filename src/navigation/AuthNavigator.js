import React from 'react'
import LoginScreen from '../screens/AuthScreen/LoginScreen'
import WelcomeScreen from '../screens/AuthScreen/WelcomeScreen'
import RegistrationScreen from '../screens/AuthScreen/RegistrationScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
        </Stack.Navigator>
    )
}


