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
    width: "40%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "right",
  },
  codeText: {
    width: "15%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "left",
  },
  amount: {
    width: "10%",
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

export class NonSalesDetailBlankSpace extends React.Component {
  render() {
    let { TableList } = this.props;

    return (
      <View style={styles.row}>
        <Text style={styles.codeText}>{``}</Text>
        <Text style={styles.codeText}>{``}</Text>
        <Text style={styles.description}>{`Total`}</Text>
        <Text style={styles.qty}>
          {TableList.nonsal_qty ? TableList.nonsal_qty : 0}
        </Text>
        <Text style={styles.amount}>
          {TableList.nonsal_amount ? TableList.nonsal_amount : "0.00"}
        </Text>
        <Text style={styles.amount}>
          {TableList.nonsal_balance ? TableList.nonsal_balance : "0.00"}
        </Text>
      </View>
    );
  }
}
