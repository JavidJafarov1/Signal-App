import {useSelector} from 'react-redux';

export const BASE_URL = 'https://2cd7-103-250-149-229.ngrok-free.app';

export const useAuthToken = () => {
  return useSelector(state => state?.auth?.userDetails?.token);
};
