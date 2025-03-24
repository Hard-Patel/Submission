/**
 * @format
 */
import * as React from 'react';
import {StackActions, NavigationContainerRef} from '@react-navigation/native';

import {RootStackParamList} from 'interface';

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T],
) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

export function push(name: keyof RootStackParamList, params?: object) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

export function currentRoute() {
  return navigationRef?.current?.getCurrentRoute()?.name;
}
