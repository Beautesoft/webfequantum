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
    marginTop: "5",
  },
  description: {
    width: "50%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "left",
  },
  outstanding: {
    width: "50%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
  extraSpace: {
    width: "30%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
});

export class PayslipHeader extends React.Component {
  render() {
    let { firstColumn, secondColumn } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.description}>{firstColumn}</Text>
        <Text style={styles.outstanding}>
          {secondColumn ? secondColumn : ""}
        </Text>
      </View>
    );
  }
}
