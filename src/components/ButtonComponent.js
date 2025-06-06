import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Color } from '../assets/color/Color'
import { scale } from 'react-native-size-matters'

const ButtonComponent = ({ buttonText, buttonStyle, buttonTextStyle, onButtonPress }) => {
    const navigation = useNavigation()
    return (
        <View>
            <TouchableOpacity style={[styles.loginButton, buttonStyle]} onPress={onButtonPress}>
                <Text style={[styles.loginText, buttonTextStyle]}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ButtonComponent

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: Color.gray,
        height: scale(50),
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginText: {
        color: Color.text,
        fontWeight: '600',
        fontSize: scale(16),
    },
})