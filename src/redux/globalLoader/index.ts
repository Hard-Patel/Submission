/**
 * @format
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {IGlobalLoader} from 'interface/loader';
import {useDispatch} from 'react-redux';
import {PersistConfig} from 'redux-persist';
import persistReducer from 'redux-persist/es/persistReducer';

export const initialState = {
  visible: false,
  text: '',
  gif: true,
};

const loaderSlice = createSlice({
  name: 'globalLoader',
  initialState,
  reducers: {
    toggleGlobalLoader: (state, {payload}) => {
      state.visible = payload.visible;
      state.text = payload.text || '';
      state.gif = payload.gif || true;
    },
  },
});

export const {toggleGlobalLoader} = loaderSlice.actions;

export const useGlobalLoaderActions = () => {
  const dispatch = useDispatch();

  return {
    toggleGlobalLoader: (data: IGlobalLoader) =>
      dispatch(toggleGlobalLoader(data)),
  };
};

const persistConfig: PersistConfig<IGlobalLoader> = {
  key: 'globalLoader',
  version: 1,
  storage: AsyncStorage,
};

export default persistReducer(persistConfig, loaderSlice.reducer);
