import React from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    minHeight: 30,
    flexGrow: 1,
    fontSize: "10px",
    alignItems: "center",
    textAlign: "center",
  },
  description: {
    width: "35%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    marginLeft: 10,
  },
  date: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  transaction: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  outstanding: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
});

export class ProductTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.date}>{`Date`}</Text>
        <Text style={styles.transaction}>{`Transaction #`}</Text>
        <Text style={styles.description}>{`Item`}</Text>
        <Text style={styles.outstanding}>{`Credit`}</Text>
        <Text style={styles.outstanding}>{`Outstanding`}</Text>
        <Text style={styles.outstanding}>{`Qty`}</Text>
        <Text style={styles.date}>{`status`}</Text>
      </View>
    );
  }
}
