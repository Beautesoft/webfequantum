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
    width: "28%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  date: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  status: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  type: {
    width: "19%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  prepaid: {
    width: "24%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  payment: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },
});

export class CreditTable extends React.Component {
  render() {
    let { items } = this.props;
    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.prepaid}>{item.credit_code}</Text>
        <Text style={styles.type}>{item.sa_date}</Text>
        <Text style={styles.type}>{item.amount}</Text>
        <Text style={styles.type}>{item.balance}</Text>
        <Text style={styles.type}>{item.status}</Text>
      </View>
    ));
  }
}
