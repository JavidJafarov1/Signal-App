import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';

const items = [
    { name: 'Билайн', icon: 'numeric-6-circle-outline' },
    { name: 'Алиса', icon: 'alpha-a-circle-outline' },
    { name: 'Яндекс Браузер', icon: 'web' },
    { name: 'Яндекс Еда', icon: 'food' },
    { name: 'Дополнительно 1', icon: 'plus-circle' },
    { name: 'Дополнительно 2', icon: 'star-circle-outline' },
];

const PartnersScreen = () => {
    return (
        <ScreenWrapper >
            <Header />

            <Text style={styles.partnerText}>Генеральный партнер АО "TБанк"</Text>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {items.map((item, index) => (
                    <View key={index} style={styles.itemCard}>
                        <MaterialCommunityIcons name={item.icon} size={40} color="#fff" />
                        <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                ))}
            </ScrollView>
        </ScreenWrapper>
    );
};

export default PartnersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 40,
    },
    bankText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    partnerText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    itemCard: {
        backgroundColor: '#111',
        padding: 20,
        marginVertical: 8,
        alignItems: 'center',
    },
    itemText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
});
