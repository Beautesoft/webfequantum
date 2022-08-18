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
    width: "45%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
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
  Type: {
    width: "12%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  Amount: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },

  creditBalance: {
    width: "14%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  outstanding: {
    width: "14%",
    borderRightColor: borderColor,
  },
});

export class AccountDetailTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.date}>{`Date`}</Text>
        <Text style={styles.description}>{`Description`}</Text>
        <Text style={styles.Type}>{`Type`}</Text>
        <Text style={styles.Amount}>{`Amount`}</Text>
        <Text style={styles.creditBalance}>{`Credit Balance`}</Text>
        <Text style={styles.outstanding}>{`Outstanding`}</Text>
      </View>
    );
  }
}
