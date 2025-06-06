import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale } from 'react-native-size-matters'
import { Color } from '../assets/color/Color'

const UpperImage = () => {
    return (
        <View >
            <View style={styles.logoContainer}>
                <View style={styles.logoBox}>
                    <View style={styles.logoInnerBox}></View>
                </View>
            </View>

        </View>
    )
}

export default UpperImage

const styles = StyleSheet.create({
    logoContainer: {
        position: 'absolute',
        top: 50
    },
    logoBox: {
        width: scale(40),
        height: scale(40),
        backgroundColor: Color.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoInnerBox: {
        width: scale(20),
        height: scale(20),
        backgroundColor: Color.blue,
    },
})