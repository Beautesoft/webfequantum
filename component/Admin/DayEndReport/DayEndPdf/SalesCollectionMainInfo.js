import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: "12px",
    borderBottom: 0,
    borderBottomColor: "#fff",
  },

  description: {
    width: "100%",
    textAlign: "center",
    marginBottom: 0,
  },
});

export class SalesCollectionMainInfo extends React.Component {
  render() {
    let { ReportedDate } = this.props;
    return (
      <View style={styles.row}>
        <Text style={styles.description}>
          Day End Report for {ReportedDate}
        </Text>
      </View>
    );
  }
}

export default SalesCollectionMainInfo;
