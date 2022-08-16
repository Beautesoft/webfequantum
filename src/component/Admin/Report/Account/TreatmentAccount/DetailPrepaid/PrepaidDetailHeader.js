import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 30,
    textAlign: "center",
    flexGrow: 1,
    fontSize: "10px",
  },
  description: {
    width: "28%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  date: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  status: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  type: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  prepaid: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  payment: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
});

export class PrepaidDetailHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.prepaid}>{`Prepaid Ref`}</Text>
        <Text style={styles.prepaid}>{`Transaction Ref`}</Text>
        <Text style={styles.type}>{`Voucher #`}</Text>
        <Text style={styles.type}>{`Item No`}</Text>
        <Text style={styles.type}>{`Item Name`}</Text>
        <Text style={styles.type}>{`Used Amt`}</Text>
        <Text style={styles.type}>{`Top up A`}</Text>
        <Text style={styles.type}>{`Balance`}</Text>
        <Text style={styles.prepaid}>{`Topup #`}</Text>
      </View>
    );
  }
}
