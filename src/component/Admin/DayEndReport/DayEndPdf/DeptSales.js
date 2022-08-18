import React from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import {
  DeptSalesTableHeader,
  DeptSalesTableRow,
  DeptSalesBlankSpace,
  DeptSalesInfo,
} from "./DeptSalesTable";

const tableRowsCount = 11;

let backColor = "#3c4087";

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

export class DeptSales extends React.Component {
  render() {
    let { DeptSalesListFinal } = this.props;
    return (
      <View style={styles.tableContainer}>
        <DeptSalesInfo />
        <DeptSalesTableHeader />
        {DeptSalesListFinal && DeptSalesListFinal.dept_sales.length > 0 ? (
          <DeptSalesTableRow items={DeptSalesListFinal.dept_sales} />
        ) : (
          <View style={styles.row}>
            <Text style={styles.description}>No data</Text>
          </View>
        )}
        <DeptSalesBlankSpace DeptSalesListFinal={DeptSalesListFinal} />
      </View>
    );
  }
}

export default DeptSales;
