import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { Color } from '../assets/colors/Color';
import CustomImage from '../components/customImage';
import { scale, verticalScale } from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ProgramDetailsScreen = () => {
    const route = useRoute();
    const data = route?.params?.item

    return (
        <SafeAreaView style={{ backgroundColor: Color.backgroundColor, flex: 1 }}>
            <Header />

            <View style={{ paddingHorizontal: scale(16), paddingTop: verticalScale(20) }}>

                <Text style={styles.textStyle}>{data?.text}</Text>

                <Text style={styles.paragraph}>
                    {data?.paragraph}
                </Text>
            </View>

        </SafeAreaView>
    )
}

export default ProgramDetailsScreen

const styles = StyleSheet.create({
    textStyle: { fontSize: scale(28), color: Color.text, textTransform: 'uppercase', },
    paragraph: { fontSize: scale(16), color: Color.text, letterSpacing: 1, lineHeight: 25, paddingTop: verticalScale(15) }
})