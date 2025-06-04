import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import { Color } from '../assets/colors/Color'

const MapScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.backgroundColor }}>
            <Header />

            <View style={{ alignItems: 'center', }}>
                <Image source={require('../assets/instagram.png')} style={{ height: 100, width: 100, backgroundColor: 'white', }} />
            </View>
        </SafeAreaView>
    )
}

export default MapScreen

const styles = StyleSheet.create({})