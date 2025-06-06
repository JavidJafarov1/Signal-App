import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { AuthStack } from './AuthNavigator'
import { UserStack } from './UserNavigator'

const RootStack = createStackNavigator()

const AppNavigator = () => {
    const user = useSelector(state => state?.authToken?.authToken)
    console.log('user', user)

    return (
        <RootStack.Navigator screenOptions={{
            headerShown: false,
        }}>
            {
                user?.length > 0
                    ? <RootStack.Screen name="UserStack" component={UserStack} />
                    : <RootStack.Screen name="AuthStack" component={AuthStack} />
            }
        </RootStack.Navigator>
    )
}

export default AppNavigator
