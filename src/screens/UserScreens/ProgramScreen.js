import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import CustomImage from '../../components/ImageComponent';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScreenWrapper from '../../components/ScreenWrapper';

const images = [
  {
    id: '0',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: false,
    type: 'Программы',
  },
  {
    id: '1',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: false,
    type: 'Open calls',
  },
  {
    id: '2',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: true,
    type: 'Сцены',
  },
  {
    id: '3',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: false,
    type: 'Open calls',
  },
  {
    id: '4',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: false,
    type: 'Open calls',
  },
  {
    id: '5',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: true,
    type: 'Open calls',
  },
  {
    id: '6',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: true,
    type: 'Сцены',
  },
  {
    id: '7',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: true,
    type: 'Open calls',
  },
  {
    id: '8',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: false,
    type: 'Программы',
  },
  {
    id: '9',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    paragraph:
      'A paragraph is a group of sentences that work together to develop a single idea or point. It typically includes a topic sentence, supporting sentences that elaborate on the topic, and a concluding sentence. For example, a paragraph about the benefits of reading might start with a topic sentence stating that reading expands knowledge, then provide supporting details about the different types of information gained through books, and finally conclude with a sentence summarizing the importance of reading for intellectual growth',
    like: true,
    type: 'Сцены',
  },
];

const ProgramScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const filters = ['Сцены', 'Программы', 'Open calls'];
  const filteredData = images.filter(item => {
    const matchesFilter = selectedFilter ? item.type === selectedFilter : true;
    const matchesFavorite = isFavorite ? item.like === true : true;
    return matchesFilter && matchesFavorite;
  });

  const handleDetailsScreenNavigate = item => {
    navigation.navigate('ProgramDetailsScreen', {item});
  };

  return (
    <ScreenWrapper>
      <Header />

      <View style={styles.header}>
        <Text style={styles.title}>Программа</Text>
        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
          <Icon name="heart" size={24} color={isFavorite ? 'blue' : 'white'} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {selectedFilter ? (
          <View style={styles.searchBox}>
            <Text style={styles.searchText}>{selectedFilter}</Text>
            <TouchableOpacity onPress={() => setSelectedFilter(null)}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.filterRow}>
            {filters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={styles.filterButton}
                onPress={() => setSelectedFilter(filter)}>
                <Text style={styles.filterText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleDetailsScreenNavigate(item)}>
              <CustomImage
                backgroundImage={{uri: item?.backgroundImage}}
                image={{uri: item?.image}}
                text={item?.text}
                fullSize={false}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ProgramScreen;

const styles = StyleSheet.create({
  content: {
    zIndex: -1,
    flex: 1,
  },
  list: {
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    color: 'white',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginTop: 15,
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  filterText: {
    color: 'white',
  },
  searchBox: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
  },
  searchText: {
    color: '#000',
  },
  clearButton: {
    fontSize: 16,
    color: '#000',
  },
  boxRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  blueBox: {
    backgroundColor: 'blue',
    height: 100,
    flex: 1,
    borderRadius: 4,
  },
});
