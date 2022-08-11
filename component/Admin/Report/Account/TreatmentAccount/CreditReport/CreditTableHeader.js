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
    width: "19%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  prepaid: {
    width: "24%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  payment: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
});

export class CreditTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.prepaid}>{`Credit #`}</Text>
        <Text style={styles.type}>{`Date`}</Text>
        <Text style={styles.type}>{`Amount`}</Text>
        <Text style={styles.type}>{`Balance`}</Text>
        <Text style={styles.type}>{`Status`}</Text>
      </View>
    );
  }
}
