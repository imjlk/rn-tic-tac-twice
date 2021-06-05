import { colors } from "@utils";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  OTPtext: {
    color: colors.lightGreen,
  },
  resendLinkWrap: {
    borderBottomColor: colors.lightGreen,
    borderBottomWidth: 1,
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  resendLink: {
    color: colors.lightGreen,
    textAlign: "center",
    paddingBottom: 6,
  },
  OTPInputBox: {
    color: colors.lightGreen,
    fontFamily: "NanumGothic_700Bold",
    fontSize: 20,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: colors.purple,
    borderBottomWidth: 1,
    borderColor: colors.lightGreen,
  },
  OTPActiveInputBox: {
    borderWidth: 1,
    borderColor: colors.lightPurple,
  },
});

export default styles;
