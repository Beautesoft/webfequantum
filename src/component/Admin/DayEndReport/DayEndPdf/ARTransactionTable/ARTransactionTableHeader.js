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
    width: "40%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "left",
  },
  codeText: {
    width: "15%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "left",
  },
  amount: {
    width: "15%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
});

export class ARTransactionTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.codeText}>{`AR Transaction`}</Text>
        <Text style={styles.codeText}>{`Customer Code`}</Text>
        <Text style={styles.codeText}>{`Customer Name`}</Text>
        <Text style={styles.description}>{`Desc`}</Text>
        <Text style={styles.amount}>{`Amount`}</Text>
      </View>
    );
  }
}
