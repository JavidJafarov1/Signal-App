import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import { Color } from '../../assets/color/Color';
import CustomImage from '../../components/ImageComponent';
import { scale, verticalScale } from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScreenWrapper from '../../components/ScreenWrapper';

const HomeDetailsScreen = () => {
    const route = useRoute();
    const data = route?.params?.item

    return (
        <ScreenWrapper>
            <Header />


            <CustomImage
                backgroundImage={{ uri: data?.backgroundImage }}
                image={{ uri: data?.image }}
                text={data?.text}
                fullSize={true}
            />

            <Text style={[styles.textStyle, { marginVertical: verticalScale(20), fontSize: scale(28) }]}>{data?.text}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <AntDesign name="earth" size={20} color={Color.white} />
                    <Text style={[styles.textStyle, { fontSize: scale(18) }]}>{data?.city}</Text>
                </View>
                <Text style={[styles.textStyle, { backgroundColor: Color.blue }]}>{data?.date}</Text>
            </View>

            <Text style={[styles.textStyle, { marginVertical: verticalScale(15), textTransform: 'capitalize', }]}>{data?.music}</Text>

            <View style={{ backgroundColor: Color.blue, height: scale(50), width: scale(50), alignItems: 'center', justifyContent: 'center' }}>
                <AntDesign name="hearto" size={28} color={Color.white} />
            </View>


        </ScreenWrapper>
    )
}

export default HomeDetailsScreen

const styles = StyleSheet.create({
    textStyle: { fontSize: scale(16), color: Color.text, textTransform: 'uppercase', }
})