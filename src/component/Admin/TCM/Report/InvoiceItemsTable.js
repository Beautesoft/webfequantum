import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";

import {
  PrescriptionMainTableHeader,
  PrescriptionMainTableRow,
} from "./MainTableReport";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#9e9e9e",
    fontSize: "10px",
  },
});

export class InvoiceItemsTable extends React.Component {
  render() {
    let { TableList, MainInfo } = this.props;

    {
      console.log(TableList, "tablelistdatafor");
    }
    return (
      <View style={styles.tableContainer}>
        <PrescriptionMainTableHeader />
        <PrescriptionMainTableRow items={TableList} MainInfo={MainInfo} />
      </View>
    );
  }
}

export default InvoiceItemsTable;
