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
    width: "15%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "right",
  },
  outstanding: {
    width: "9%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
  otherText: {
    width: "12%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "left",
  },
  outlet: {
    width: "7%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
});

export class TreatmentDoneBlankSpace extends React.Component {
  render() {
    let { TableList } = this.props;

    return (
      <View style={styles.row}>
        <Text style={styles.otherText}>{``}</Text>
        <Text style={styles.otherText}>{``}</Text>
        <Text style={styles.otherText}>{``}</Text>
        <Text style={styles.description}>{``}</Text>
        <Text style={styles.otherText}>{``}</Text>
        <Text style={styles.otherText}>{``}</Text>
        <Text style={styles.outlet}>{``}</Text>
        <Text style={styles.outlet}>{`Total`}</Text>

        <Text style={styles.outstanding}>
          {TableList.total_amount ? TableList.total_amount : "0.00"}
        </Text>
      </View>
    );
  }
}
