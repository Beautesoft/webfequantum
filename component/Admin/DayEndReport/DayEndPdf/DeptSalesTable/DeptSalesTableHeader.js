import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const backColor = "#3c4087";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: backColor,
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 30,
    textAlign: "center",
    color: "#fff",
    flexGrow: 1,
    fontSize: "10px",
    backgroundColor: backColor,
  },
  description: {
    width: "70%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "left",
  },
  outstanding: {
    width: "30%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
  qty: {
    width: "10%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
});

export class DeptSalesTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.description}>{`Dept Sales`}</Text>
        <Text style={styles.outstanding}>{`Amount`}</Text>
      </View>
    );
  }
}
