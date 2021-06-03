import React, { ReactElement, forwardRef } from "react";
import {
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
} from "react-native";
import styles from "./text-input.styles";

const TextInput = forwardRef<NativeTextInput, NativeTextInputProps>(
  ({ style, ...props }: NativeTextInputProps, ref): ReactElement => {
    return (
      <NativeTextInput
        {...props}
        ref={ref}
        style={[style, styles.input]}
        placeholderTextColor="#5d5379"
      />
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
