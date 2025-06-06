import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale, verticalScale } from 'react-native-size-matters'
import { Color } from '../assets/color/Color'

const UpperImage = () => {
    return (
        <View>
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
        top: verticalScale(50),
    },
    logoBox: {
        width: scale(36),
        height: scale(36),
        backgroundColor: Color.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoInnerBox: {
        width: scale(18),
        height: scale(18),
        backgroundColor: Color.blue,
    },
})