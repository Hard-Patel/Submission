import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { fontFamily, useAppTheme } from "theme";

export const EmptyDeviceListComponent = (props: {
  message: string;
  customStyle?: StyleProp<ViewStyle>;
}) => {
  const { message, customStyle } = props;
  const theme = useAppTheme();
  return (
    <View
      style={{
        flex: 0.9,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background[900],
        // @ts-ignore
        ...customStyle,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          lineHeight: 36,
          fontFamily: fontFamily.medium,
          color: theme.colors.text[600],
        }}
      >
        {message}
      </Text>
    </View>
  );
};
