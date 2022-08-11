import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#9e9e9e";
const styles = StyleSheet.create({
  row: {
    // flexDirection: "row",
    // borderBottomColor: "#bff0fd",
    // borderBottomWidth: 1,
    // height: 55,
    // flexGrow: 1,
    // fontSize: "9px",
    // alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "#9e9e9e",
    borderBottomWidth: 1,
    flexGrow: 1,
    fontSize: "9px",
    alignItems: "center",
    minHeight: 35,
  },

  description: {
    width: "24%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },

  outstanding: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },
  qty: {
    width: "6%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    marginRight: 10,
  },
  uom: {
    width: "6%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    marginRight: 10,
  },
  sno: {
    width: "5%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    marginRight: 10,
  },
  group: {
    width: "7%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    marginRight: 10,
  },

  remarks: {
    width: "18%",
  },
});
export class PrescriptionMainTableRow extends React.Component {
  render() {
    let { items, MainInfo } = this.props;

    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.sno}>{index + 1}</Text>
        <Text style={styles.group}>{item.itemGroup}</Text>
        <Text style={styles.group}>{``}</Text>
        <Text style={styles.description}>{item.itemDesc}</Text>
        <Text style={styles.uom}>{item.itemQty}</Text>
        <Text style={styles.uom}>
          {item.itemQty * MainInfo.daysToTakeMedicine}
        </Text>
        <Text style={styles.uom}>{item.itemUOM}</Text>
        <Text style={styles.uom}>{MainInfo.daysToTakeMedicine}</Text>
        <Text style={styles.qty}>{``}</Text>
        <Text style={styles.remarks}>{item.remark}</Text>
      </View>
    ));
  }
}
