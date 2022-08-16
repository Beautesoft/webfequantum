import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    minHeight: 30,
    flexGrow: 1,
    fontSize: "9px",
    alignItems: "center",
  },

  description: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    textAlign: "center",
  },
  date: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },

  transaction: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  payment: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },
  creditBalance: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },
  outstanding: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },
  qty: {
    width: "5%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    marginRight: 10,
  },
  balance_qty: {
    width: "10%",
    textAlign: "right",
    marginRight: 10,
  },
});
export class AccountMainTableRow extends React.Component {
  render() {
    let { items } = this.props;
    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.date}>{item.sa_date}</Text>
        <Text style={styles.transaction}>{item.transaction}</Text>
        <Text style={styles.transaction}>{item.treatment_parentcode}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.payment}>{item.payment}</Text>
        <Text style={styles.creditBalance}>{item.balance}</Text>
        <Text style={styles.outstanding}>{item.outstanding}</Text>
        <Text style={styles.qty}>{item.qty}</Text>
        <Text style={styles.balance_qty}>{item.balance_qty}</Text>
      </View>
    ));
  }
}
