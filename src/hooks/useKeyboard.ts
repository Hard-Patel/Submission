/**
 * @format
 */
import {useEffect, useState} from 'react';
import {Keyboard, KeyboardEventListener} from 'react-native';

import {isAndroid} from '../constants';

const emptyCoordinates = Object.freeze({
  screenX: 0,
  screenY: 0,
  width: 0,
  height: 0,
});

const initialValue = {
  start: emptyCoordinates,
  end: emptyCoordinates,
};

export const useKeyboard = () => {
  const [shown, setShown] = useState(false);

  const [coordinates, setCoordinates] = useState<{
    start: undefined | any;
    end: any;
  }>(initialValue);

  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const handleKeyboardWillShow: KeyboardEventListener = e => {
    setShown(true);
    setCoordinates({start: e.startCoordinates, end: e.endCoordinates});
    setKeyboardHeight(e.endCoordinates.height);
  };

  const handleKeyboardWillHide: KeyboardEventListener = e => {
    setShown(false);
    if (e) {
      setCoordinates({start: e.startCoordinates, end: e.endCoordinates});
    } else {
      setCoordinates(initialValue);
      setKeyboardHeight(0);
    }
  };

  useEffect(() => {
    if (Keyboard.isVisible()) {
      setShown(true);
    }
    const subscriptions = isAndroid
      ? [
          Keyboard.addListener('keyboardDidShow', handleKeyboardWillShow),
          Keyboard.addListener('keyboardDidHide', handleKeyboardWillHide),
        ]
      : [
          Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow),
          Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide),
        ];

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  return {
    keyboardShown: shown,
    coordinates,
    keyboardHeight,
  };
};
