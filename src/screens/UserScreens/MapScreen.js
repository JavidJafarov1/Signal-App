import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import { Color } from '../../assets/color/Color'
import ScreenWrapper from '../../components/ScreenWrapper'

const MapScreen = () => {
    return (
        <ScreenWrapper>
            <Header />

            <View style={{ alignItems: 'center', }}>
                <Image source={require('../../assets/image/instagram.png')} style={{ height: 100, width: 100, backgroundColor: 'white', }} />
            </View>
        </ScreenWrapper>
    )
}

export default MapScreen

const styles = StyleSheet.create({})