// import {
//   ImageBackground,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useState} from 'react';
// import Header from '../../components/Header';
// import {Color} from '../../assets/color/Color';
// import CustomImage from '../../components/ImageComponent';
// import {scale, verticalScale} from 'react-native-size-matters';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import useAppHooks from '../../auth/useAppHooks';
// import {LikeArt} from '../../utils/Apis/AllArtist';
// import {useSelector} from 'react-redux';
// import {useAuthToken} from '../../utils/api';

// const HomeDetailsScreen = () => {
//   const {navigation, t, route} = useAppHooks();
//   const data = route?.params?.item;
//   const id = data?._id;
//   const token = useAuthToken();

//   const [like, setLike] = useState();
//   console.log('data', data?.like);

//   const likeArtist = async () => {
//     try {
//       const response = await LikeArt(id, token);
//       setLike(response?.liked);
//     } catch (error) {}
//   };

//   return (
//     <ScreenWrapper>
//       <Header />

//       <CustomImage
//         backgroundImage={{uri: data?.backgroundImage}}
//         image={{uri: data?.image}}
//         text={data?.text}
//         fullSize={true}
//       />

//       <Text
//         style={[
//           styles.textStyle,
//           {marginVertical: verticalScale(20), fontSize: scale(28)},
//         ]}>
//         {data?.text}
//       </Text>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}>
//         <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
//           <AntDesign name="earth" size={20} color={Color.white} />
//           <Text style={[styles.textStyle, {fontSize: scale(18)}]}>
//             {data?.location}
//           </Text>
//         </View>
//         <Text style={[styles.textStyle, {backgroundColor: Color.blue}]}>
//           {data?.date}
//         </Text>
//       </View>

//       <Text
//         style={[
//           styles.textStyle,
//           {marginVertical: verticalScale(15), textTransform: 'capitalize'},
//         ]}>
//         {data?.music}
//       </Text>

//       <TouchableOpacity
//         style={{
//           backgroundColor: Color.blue,
//           height: scale(50),
//           width: scale(50),
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//         onPress={() => likeArtist()}>
//         <AntDesign
//           name={like ? 'heart' : 'hearto'}
//           size={28}
//           color={Color.white}
//         />
//       </TouchableOpacity>
//     </ScreenWrapper>
//   );
// };

// export default HomeDetailsScreen;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: scale(16),
//     color: Color.text,
//     textTransform: 'uppercase',
//   },
// });


import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {Color} from '../../assets/color/Color';
import CustomImage from '../../components/ImageComponent';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScreenWrapper from '../../components/ScreenWrapper';
import useAppHooks from '../../auth/useAppHooks';
import {LikeArt} from '../../utils/Apis/AllArtist';
import {useAuthToken} from '../../utils/api';

const HomeDetailsScreen = () => {
  const {navigation, t, route} = useAppHooks();
  const data = route?.params?.item;
  const id = data?._id;
  const token = useAuthToken();

  const [like, setLike] = useState(false);

  useEffect(() => {
    console.log('data', data?.like);
    setLike(data?.like === true); // safely set boolean
  }, [data]);

  const likeArtist = async () => {
    const newLikeState = !like;
    setLike(newLikeState); // optimistic update

    try {
      const response = await LikeArt(id, token);
      setLike(response?.liked === true); // confirm from API response
    } catch (error) {
      console.error('Error liking artist:', error);
      setLike(!newLikeState); // revert if failed
    }
  };

  return (
    <ScreenWrapper>
      <Header />

      <CustomImage
        backgroundImage={{uri: data?.backgroundImage}}
        image={{uri: data?.image}}
        text={data?.text}
        fullSize={true}
      />

      <Text
        style={[
          styles.textStyle,
          {marginVertical: verticalScale(20), fontSize: scale(28)},
        ]}>
        {data?.text}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <AntDesign name="earth" size={20} color={Color.white} />
          <Text style={[styles.textStyle, {fontSize: scale(18)}]}>
            {data?.location}
          </Text>
        </View>
        <Text style={[styles.textStyle, {backgroundColor: Color.blue}]}>
          {data?.date}
        </Text>
      </View>

      <Text
        style={[
          styles.textStyle,
          {marginVertical: verticalScale(15), textTransform: 'capitalize'},
        ]}>
        {data?.music}
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: Color.blue,
          height: scale(50),
          width: scale(50),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={likeArtist}>
        <AntDesign
          name={like ? 'heart' : 'hearto'}
          size={28}
          color={Color.white}
        />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default HomeDetailsScreen;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: scale(16),
    color: Color.text,
    textTransform: 'uppercase',
  },
});
