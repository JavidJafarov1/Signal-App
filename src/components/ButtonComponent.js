import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Color } from '../assets/color/Color'
import { scale } from 'react-native-size-matters'

const ButtonComponent = ({ buttonText, buttonStyle, buttonTextStyle, onButtonPress }) => {
    return (
        <View>
            <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onButtonPress}>
                <Text style={[styles.text, buttonTextStyle]}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ButtonComponent

const styles = StyleSheet.create({
    button: {
        backgroundColor: Color.gray,
        height: scale(46),
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: Color.text,
        fontWeight: '600',
        fontSize: scale(16),
    },
})