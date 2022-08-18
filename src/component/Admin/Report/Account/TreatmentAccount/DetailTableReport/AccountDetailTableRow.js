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
    width: "45%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textOverflow: "hidden",
    textAlign: "left",
  },
  date: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  Type: {
    width: "12%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    textOverflow: "hidden",
  },
  Amount: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },

  creditBalance: {
    width: "14%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },
  outstanding: {
    width: "14%",
    borderRightColor: borderColor,
    textAlign: "right",
  },
});
export class AccountDetailTableRow extends React.Component {
  render() {
    let { items } = this.props;
    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.date}>{item.sa_date}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.Type}>{item.type}</Text>
        <Text style={styles.Amount}>{item.amount}</Text>
        <Text style={styles.creditBalance}>{item.balance}</Text>
        <Text style={styles.outstanding}>{item.outstanding}</Text>
      </View>
    ));
  }
}
