import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from "react-native";
import React from "react";
import { SCREEN_WIDTH } from "../../constants";
import { fontFamily, useAppTheme } from "theme";
import { CloseIcon } from "assets/svg";

export const SearchComponent = React.useCallback(
  ({
    value,
    setValue,
    fullWidth,
    placeholder = "Try search device with name or IMEI"
  }: {
    value: string;
    placeholder?: string;
    setValue: (text: string) => void;
    fullWidth?: boolean;
  }) => {
    const theme = useAppTheme();
    return (
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            width: fullWidth ? SCREEN_WIDTH * 0.8 : SCREEN_WIDTH * 0.7,
            height: 50,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.border[900],
            backgroundColor: theme.colors.background[950],
          }
        ]}
      >
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          style={{
            paddingHorizontal: 12,
            fontSize: 14,
            textAlignVertical: "center",
            color: theme.colors.text[900],
            fontFamily: fontFamily.regular,
            width: "90%",
          }}
          placeholderTextColor={theme.colors.text[800]}
        />
        <TouchableOpacity
          onPress={() => {
            setValue("");
          }}
          style={{ marginTop: -3 }}
        >
          <CloseIcon height={18} width={18} />
        </TouchableOpacity>
      </View>
    );
  },
  []
);
