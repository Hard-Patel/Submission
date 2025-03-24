/**
 * @format
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PersistConfig, persistReducer} from 'redux-persist';

import {RootState} from '../store';
import {useDispatch, useSelector} from 'react-redux';
import { ICustomModalState } from 'interface/login';

const initialState: ICustomModalState = {
    isVisible: false,
    cancel: 'cancel',
    confirm: 'Confirm',
    description: '',
    title: '',
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<ICustomModalState>) => {
      state = action.payload;
    },
  },
});

export const {
  addHistory,
} = historySlice.actions;

export const useHistoryActions = () => {
  const dispatch = useDispatch();

  return {
    addHistory: (data: ICustomModalState) => dispatch(addHistory(data)),
  };
};


const persistConfig: PersistConfig<ICustomModalState> = {
  key: 'history',
  version: 1,
  storage: AsyncStorage,
  // blacklist: ['userAuthData'],
};

export default persistReducer(persistConfig, historySlice.reducer);
