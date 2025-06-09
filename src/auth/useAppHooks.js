import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';

const useAppHooks = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  return {
    navigation,
    route,
    t,
    dispatch,
  };
};

export default useAppHooks;
