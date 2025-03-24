import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {useAppTheme} from 'theme';

const LoadingListView = () => {
  const theme = useAppTheme();
  return (
    <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator color={theme.colors.primary[900]} size={'small'} />
    </View>
  );
};

export default LoadingListView;
