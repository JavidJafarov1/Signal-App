import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import {Color} from '../assets/color/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import UpperImage from './UpperImage';

const screenWidth = Dimensions.get('window').width;

const CustomImage = ({backgroundImage, image, text, fullSize}) => {
  return (
    <View style={[fullSize ? styles.fullSizeImage : styles.imageWrapper]}>
      <ImageBackground
        source={backgroundImage}
        style={[{height: fullSize ? 300 : 150}, styles.image]}
        resizeMode="cover">
        <View style={{flex: 1, padding: scale(12)}}>
          {/* <Image source={image} style={{height: 20, width: 20}} /> */}
          <UpperImage
            logo={true}
            style={{height: 20, width: 20}}
            innerStyle={{height: 10, width: 10}}
          />
          <Text
            style={{
              position: 'absolute',
              bottom: 10,
              left: 12,
              color: Color.text,
            }}>
            {text}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CustomImage;

const styles = StyleSheet.create({
  imageWrapper: {
    width: screenWidth / 2 - 20,
    margin: scale(5),
  },
  fullSizeImage: {
    width: '100%',
    margin: 5,
    alignSelf: 'center',
    marginTop: verticalScale(20),
  },

  image: {
    width: '100%',
    borderRadius: 8,
  },
});
