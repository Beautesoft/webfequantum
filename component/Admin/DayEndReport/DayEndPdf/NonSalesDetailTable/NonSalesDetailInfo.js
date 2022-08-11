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

export class NonSalesDetailInfo extends React.Component {
  render() {
    return (
      <View style={styles.row}>
        <Text style={styles.description}>Non Sales Collection Detail</Text>
      </View>
    );
  }
}
