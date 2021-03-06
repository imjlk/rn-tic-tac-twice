import { colors } from "@utils";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  registerLinkWrap: {
    borderBottomColor: colors.lightGreen,
    borderBottomWidth: 1,
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  registerLink: {
    color: colors.lightGreen,
    textAlign: "center",
    marginTop: 20,
    paddingBottom: 6,
  },
});

export default styles;
