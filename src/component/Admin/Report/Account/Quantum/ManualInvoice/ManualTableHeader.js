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
    width: "49%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
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
    width: "12%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },
  prepaid: {
    width: "24%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  payment: {
    width: "15%",
    borderRightColor: borderColor,
    textAlign: "left",
  },
});

export class ManualTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.payment}>{`Code`}</Text>
        <Text style={styles.description}>{`Description`}</Text>
        <Text style={styles.type}>{`Quantity`}</Text>
        <Text style={styles.type}>{`Unit Price`}</Text>
        <Text style={styles.type}>{`Amount`}</Text>
      </View>
    );
  }
}
