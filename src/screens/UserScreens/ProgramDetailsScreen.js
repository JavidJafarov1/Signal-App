import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import { Color } from '../../assets/color/Color';
import CustomImage from '../../components/ImageComponent';
import { scale, verticalScale } from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScreenWrapper from '../../components/ScreenWrapper';

const ProgramDetailsScreen = () => {
    const route = useRoute();
    const data = route?.params?.item

    return (
        <ScreenWrapper>
            <Header />

            <View style={{ paddingTop: verticalScale(20) }}>

                <Text style={styles.textStyle}>{data?.text}</Text>

                <Text style={styles.paragraph}>
                    {data?.paragraph}
                </Text>
            </View>

        </ScreenWrapper>
    )
}

export default ProgramDetailsScreen

const styles = StyleSheet.create({
    textStyle: { fontSize: scale(28), color: Color.text, textTransform: 'uppercase', },
    paragraph: { fontSize: scale(16), color: Color.text, letterSpacing: 1, lineHeight: 25, paddingTop: verticalScale(15) }
})