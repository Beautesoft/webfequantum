import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const backColor = "#cddff3";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#cddff3",
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 20,
    fontSize: "9px",
    backgroundColor: backColor,
  },
  description: {
    width: "18%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "right",
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

export class SalesTransactionBlankSpace extends React.Component {
  render() {
    let { TableList } = this.props;

    return (
      <View style={styles.row}>
        <Text style={styles.otherText}>{``}</Text>
        <Text style={styles.otherText}>{``}</Text>
        <Text style={styles.otherText}>{``}</Text>
        <Text style={styles.description}>{`Total`}</Text>
        <Text style={styles.qty}>
          {TableList.depo_qty ? TableList.depo_qty : 0}
        </Text>
        <Text style={styles.outstanding}>
          {TableList.total_amount ? TableList.total_amount : "0.00"}
        </Text>
        <Text style={styles.outstanding}>
          {TableList.depo_balance ? TableList.depo_balance : "0.00"}
        </Text>
        <Text style={styles.outstanding}>
          {TableList.depo_amt ? TableList.depo_amt : "0.00"}
        </Text>
        <Text style={styles.outstanding}>
          {TableList.total_paid ? TableList.total_paid : "0.00"}
        </Text>
        <Text style={styles.outstanding}>
          {TableList.total_outstanding ? TableList.total_outstanding : "0.00"}
        </Text>
      </View>
    );
  }
}
