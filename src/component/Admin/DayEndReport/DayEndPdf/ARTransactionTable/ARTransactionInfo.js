import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 0,
    alignItems: "center",
    fontSize: "10px",
    minHeight: 30,
  },

  description: {
    width: "100%",
    textAlign: "center",
  },
});

export class ARTransactionInfo extends React.Component {
  render() {
    return (
      <View style={styles.row}>
        <Text style={styles.description}>AR Transaction</Text>
      </View>
    );
  }
}
