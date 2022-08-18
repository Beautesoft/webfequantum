import React from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import {
  NonSalesDetailBlankSpace,
  NonSalesDetailInfo,
  NonSalesDetailTableHeader,
  NonSalesDetailTableRow,
} from "./NonSalesDetailTable";

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

export class NonSalesDetail extends React.Component {
  render() {
    let { NonSalesDetailCollectionList } = this.props;
    debugger;
    return (
      <View style={styles.tableContainer}>
        <NonSalesDetailInfo />
        <NonSalesDetailTableHeader />
        {NonSalesDetailCollectionList.nonsales_dtl &&
        NonSalesDetailCollectionList.nonsales_dtl.length > 0 ? (
          <NonSalesDetailTableRow
            items={NonSalesDetailCollectionList.nonsales_dtl}
          />
        ) : (
          <View style={styles.row}>
            <Text style={styles.description}>No data</Text>
          </View>
        )}
        <NonSalesDetailBlankSpace TableList={NonSalesDetailCollectionList} />
      </View>
    );
  }
}

export default NonSalesDetail;
