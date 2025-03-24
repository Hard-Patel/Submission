import { useAppTheme } from "theme";
import { showMessage } from "react-native-flash-message";
import { ToastMessageProps } from "../interface/user";
import { useQueryClient } from "react-query";
import { StatusBar } from "react-native";

export const useUtils = () => {
  const theme = useAppTheme();
  const queryClient = useQueryClient();

  const showToast = (toastProps: ToastMessageProps) => {
    const {
      message = "",
      description = "",
      duration = 2000,
      color = theme.colors.white[900],
      backgroundColor = theme.colors.primary[900],
      type = "default",
      ...rest
    } = toastProps;
    showMessage({
      message: message,
      description: description,
      type: type,
      backgroundColor: backgroundColor, // background color
      color: color,
      duration,
      statusBarHeight: StatusBar.currentHeight,
      ...rest,
    });
  };

  const hardRefetchQueries = (queryKeys: string[]) => {
    queryClient.cancelQueries(queryKeys);
    queryClient.resetQueries(queryKeys);
    queryClient.invalidateQueries(queryKeys, {refetchActive: true});
    queryClient.refetchQueries(queryKeys);
  }

  return { showToast, hardRefetchQueries };
};
