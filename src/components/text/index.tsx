import React, { ReactElement, ReactNode } from "react";
import { Text as NativeText, TextProps as NativeTextProps } from "react-native";

type TextProps = {
  weight: 400 | 700 | 800;
  children: ReactNode;
} & NativeTextProps;

const defaultProps = {
  weight: 400,
};

export default function Text({
  children,
  style,
  weight,
  ...props
}: TextProps): ReactElement {
  let fontFamily;

  switch (weight) {
    case 400:
      fontFamily = "NanumGothic_400Regular";
      break;
    case 700:
      fontFamily = "NanumGothic_700Bold";
      break;
    case 800:
      fontFamily = "NanumGothic_800ExtraBold";
      break;
  }

  return (
    <NativeText {...props} style={[{ fontFamily }, style]}>
      {children}
    </NativeText>
  );
}

Text.defaultProps = defaultProps;
