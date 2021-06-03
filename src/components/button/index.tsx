import React, { ReactElement } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import Text from "../text";
import styles from "./button.styles";

type ButtonProps = {
  title: string;
  loading?: boolean;
} & TouchableOpacityProps;

export default function Button({
  title,
  style,
  loading,
  ...props
}: ButtonProps): ReactElement {
  return (
    <TouchableOpacity
      disabled={loading}
      style={[styles.button, style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
