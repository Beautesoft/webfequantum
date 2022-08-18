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
    width: "70%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "right",
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

export class DeptSalesBlankSpace extends React.Component {
  render() {
    let { DeptSalesListFinal } = this.props;

    return (
      <View style={styles.row}>
        <Text style={styles.description}>{`Total`}</Text>
        <Text style={styles.outstanding}>
          {DeptSalesListFinal.total_amount
            ? DeptSalesListFinal.total_amount
            : "0.00"}
        </Text>
      </View>
    );
  }
}
