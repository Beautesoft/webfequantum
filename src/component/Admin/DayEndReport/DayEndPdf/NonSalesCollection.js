import React from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import {
  NonSalesCollectionBlankSpace,
  NonSalesCollectionInfo,
  NonSalesCollectionTableHeader,
  NonSalesCollectionTableRow,
} from "./NonSalesCollectionTable";

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

export class NonSalesCollection extends React.Component {
  render() {
    let { TableList } = this.props;

    return (
      <View style={styles.tableContainer}>
        <NonSalesCollectionInfo />
        <NonSalesCollectionTableHeader />
        {TableList.nonsales && TableList.nonsales.length > 0 ? (
          <NonSalesCollectionTableRow items={TableList.nonsales} />
        ) : (
          <View style={styles.row}>
            <Text style={styles.description}>No data</Text>
          </View>
        )}
        <NonSalesCollectionBlankSpace TableList={TableList} />
      </View>
    );
  }
}

export default NonSalesCollection;
