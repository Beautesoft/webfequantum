import React from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import {
  SalesCollectionBlankSpace,
  SalesCollectionInfo,
  SalesCollectionTableHeader,
  SalesCollectionTableRow,
} from "./SalesCollectionTable";

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

export class SalesCollection extends React.Component {
  render() {
    let { TableList } = this.props;

    return (
      <View style={styles.tableContainer}>
        <SalesCollectionInfo />
        <SalesCollectionTableHeader />
        {TableList.sales && TableList.sales.length > 0 ? (
          <SalesCollectionTableRow items={TableList.sales} />
        ) : (
          <View style={styles.row}>
            <Text style={styles.description}>No data</Text>
          </View>
        )}
        <SalesCollectionBlankSpace TableList={TableList} />
      </View>
    );
  }
}

export default SalesCollection;
