import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../assets/color/Color';
import Header from '../components/Header';
import CustomImage from '../components/ImageComponent';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import ScreenWrapper from '../components/ScreenWrapper';

const images = [
    { id: "0", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
    { id: "1", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
    { id: "2", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
    { id: "3", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
    { id: "4", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
    { id: "5", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
    { id: "6", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
    { id: "7", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
    { id: "8", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
    { id: "9", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', paragraph: 'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth' },
];

const ProgramScreen = () => {

    const navigation = useNavigation();
    const hadleDetailsScreenNavigate = (item) => {
        navigation.navigate('ProgramDetailsScreen', { item })
    }

    return (
        <ScreenWrapper >
            <Header />

            <View style={styles.content}>
                <FlatList
                    data={images}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => hadleDetailsScreenNavigate(item)}>
                            <CustomImage
                                backgroundImage={{ uri: item?.backgroundImage }}
                                image={{ uri: item?.image }}
                                text={item?.text}
                                fullSize={false}
                            />
                        </Pressable>
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                />
            </View>
        </ScreenWrapper>
    )
}

export default ProgramScreen

const styles = StyleSheet.create({
    content: {
        zIndex: -1,
        flex: 1
    },
    list: {
        justifyContent: "center",
    },
})