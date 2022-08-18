import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

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

export class TreatmentDoneInfo extends React.Component {
  render() {
    return (
      <View style={styles.row}>
        <Text style={styles.description}>Treatment Done</Text>
      </View>
    );
  }
}
