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
    width: "50%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "right",
  },
  outstanding: {
    width: "20%",
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

export class SalesCollectionBlankSpace extends React.Component {
  render() {
    let { TableList } = this.props;

    return (
      <View style={styles.row}>
        <Text style={styles.description}>{`Total`}</Text>
        <Text style={styles.outstanding}>
          {TableList.total_tax ? TableList.total_tax : "0.00"}
        </Text>
        <Text style={styles.outstanding}>
          {TableList.total ? TableList.total : "0.00"}
        </Text>
        <Text style={styles.qty}>{TableList.qty ? TableList.qty : "0"}</Text>
      </View>
    );
  }
}
