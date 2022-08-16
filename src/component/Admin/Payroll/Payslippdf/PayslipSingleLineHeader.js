import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const backColor = "#3c4087";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: backColor,
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 20,
    textAlign: "center",
    color: "#fff",
    flexGrow: 1,
    fontSize: "10px",
    backgroundColor: backColor,
    marginTop: "10",
  },
  description: {
    width: "100%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "left",
  },
});

export class PayslipSingleLineHeader extends React.Component {
  render() {
    let { columnLabel } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.description}>{columnLabel}</Text>
      </View>
    );
  }
}
