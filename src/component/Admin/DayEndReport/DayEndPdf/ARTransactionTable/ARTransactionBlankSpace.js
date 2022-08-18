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
    width: "15%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
});

export class ARTransactionBlankSpace extends React.Component {
  render() {
    let { TableList } = this.props;

    return (
      <View style={styles.row}>
        <Text style={styles.codeText}>{``}</Text>
        <Text style={styles.codeText}>{``}</Text>
        <Text style={styles.codeText}>{``}</Text>
        <Text style={styles.description}>{`Total`}</Text>
        <Text style={styles.amount}>
          {TableList.total_amount ? TableList.total_amount : "0.00"}
        </Text>
      </View>
    );
  }
}
