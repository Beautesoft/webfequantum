import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 30,
    textAlign: "center",

    flexGrow: 1,
    fontSize: "10px",
  },
  description: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  date: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  transaction: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  payment: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  creditBalance: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  outstanding: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: "5%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    marginRight: 10,
  },
  balance_qty: {
    width: "10%",
    overflow: "hidden",
    marginRight: 10,
  },
});

export class AccountMainTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.date}>{`Date`}</Text>
        <Text style={styles.transaction}>{`Transac #`}</Text>
        <Text style={styles.transaction}>{`Treatment #`}</Text>
        <Text style={styles.description}>{`Description`}</Text>
        <Text style={styles.payment}>{`Payment`}</Text>
        <Text style={styles.creditBalance}>{`Credit Balance`}</Text>
        <Text style={styles.outstanding}>{`Outstanding`}</Text>
        <Text style={styles.qty}>{`Qty`}</Text>
        <Text style={styles.balance_qty}>{`Balance Qty`}</Text>
      </View>
    );
  }
}
