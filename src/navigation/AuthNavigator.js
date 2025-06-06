import React from 'react'
import WelcomeScreen from '../screens/AuthScreens/WelcomeScreen'
import RegistrationScreen from '../screens/AuthScreens/RegistrationScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import EmailConfirmationScreen from '../screens/AuthScreens/EmailConfirmationScreen'
import PasswordConfirmationScreen from '../screens/AuthScreens/PasswordConfirmationScreen'

const Stack = createNativeStackNavigator()

export const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="EmailConfirmationScreen" component={EmailConfirmationScreen} />
            <Stack.Screen name="PasswordConfirmationScreen" component={PasswordConfirmationScreen} />
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
        </Stack.Navigator>
    )
}


