import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PersistConfig} from 'redux-persist';

import {useAppDispatch} from '../store';
import {ICustomModalState, IModalInformationData} from 'interface/login';
import persistReducer from 'redux-persist/es/persistReducer';
import { IModalType } from 'interface/user';

const initialState: ICustomModalState = {
  modalInformation: {
    isVisible: false,
    cancel: 'cancel',
    confirm: 'Confirm',
    description: '',
    title: '',
    type: IModalType.LOGOUT
  },
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showCustomDialog: (state, action: PayloadAction<IModalInformationData>) => {
      state.modalInformation = action.payload;
    },
    hideCustomDialog: state => {
      state.modalInformation.isVisible = false;
    },
  },
});

export const {showCustomDialog, hideCustomDialog} = modalSlice.actions;

export const useModalActions = () => {
  const dispatch = useAppDispatch();

  return {
    showDialog: async (data: IModalInformationData) => {
      dispatch(showCustomDialog(data));
    },
    hideDialog: async () => {
      dispatch(hideCustomDialog());
    },
  };
};

const persistConfig: PersistConfig<ICustomModalState> = {
  key: 'modal',
  version: 1,
  storage: AsyncStorage,
  blacklist: [],
};

export default persistReducer(persistConfig, modalSlice.reducer);
