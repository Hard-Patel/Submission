import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";
import { useAppThemeName } from "./useTheme";

export const extractTheme = () => {
  const themeName = useAppThemeName();
  return themeName === "light" ? "light" : "dark";
};

export const applicationTheme = (extractTheme() === "light") ? lightTheme : darkTheme;