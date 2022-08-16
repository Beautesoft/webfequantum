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
    width: "18%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "left",
  },
  outstanding: {
    width: "8%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
  otherText: {
    width: "12%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "left",
  },
  qty: {
    width: "6%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
});

export class SalesTransactionTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.otherText}>{`Sales Transaction`}</Text>
        <Text style={styles.otherText}>{`Customer Code`}</Text>
        <Text style={styles.otherText}>{`Customer Name`}</Text>
        <Text style={styles.description}>{`Desc`}</Text>
        <Text style={styles.qty}>{`Qty`}</Text>
        <Text style={styles.outstanding}>{`Amount`}</Text>
        <Text style={styles.outstanding}>{`Balance`}</Text>
        <Text style={styles.outstanding}>{`Net Amount`}</Text>
        <Text style={styles.outstanding}>{`Paid`}</Text>
        <Text style={styles.outstanding}>{`Outstanding`}</Text>
      </View>
    );
  }
}
