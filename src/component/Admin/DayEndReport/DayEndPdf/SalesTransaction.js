import React from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import {
  SalesTransactionBlankSpace,
  SalesTransactionInfo,
  SalesTransactionTableHeader,
  SalesTransactionTableRow,
} from "./SalesTransactionTable";

const tableRowsCount = 11;
const backColor = "#3c4087";
const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: backColor,
    fontSize: "10px",
  },
  row: {
    flexDirection: "row",
    borderBottomColor: backColor,
    borderBottomWidth: 1,
    alignItems: "center",
    fontSize: "10px",
  },

  description: {
    width: "100%",
    textAlign: "center",
  },
});

export class SalesTransaction extends React.Component {
  render() {
    let { salesTransactionList } = this.props;

    return (
      <View style={styles.tableContainer}>
        <SalesTransactionInfo />
        <SalesTransactionTableHeader />
        {salesTransactionList.sales_trasac &&
        salesTransactionList.sales_trasac.length > 0 ? (
          <SalesTransactionTableRow items={salesTransactionList.sales_trasac} />
        ) : (
          <View style={styles.row}>
            <Text style={styles.description}>No data</Text>
          </View>
        )}
        <SalesTransactionBlankSpace TableList={salesTransactionList} />
      </View>
    );
  }
}

export default SalesTransaction;
