import React from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import {
  ARTransactionBlankSpace,
  ARTransactionInfo,
  ARTransactionTableHeader,
  ARTransactionTableRow,
} from "./ARTransactionTable";

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

export class ARTransaction extends React.Component {
  render() {
    let { ARTransactionList } = this.props;
    debugger;
    return (
      <View style={styles.tableContainer}>
        <ARTransactionInfo />
        <ARTransactionTableHeader />
        {ARTransactionList.ar_trasac &&
        ARTransactionList.ar_trasac.length > 0 ? (
          <ARTransactionTableRow items={ARTransactionList.ar_trasac} />
        ) : (
          <View style={styles.row}>
            <Text style={styles.description}>No data</Text>
          </View>
        )}
        <ARTransactionBlankSpace TableList={ARTransactionList} />
      </View>
    );
  }
}

export default ARTransaction;
