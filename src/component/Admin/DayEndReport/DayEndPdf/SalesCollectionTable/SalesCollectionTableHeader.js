import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const backColor = "#3c4087";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: backColor,
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 30,
    textAlign: "center",
    color: "#fff",
    flexGrow: 1,
    fontSize: "10px",
    backgroundColor: backColor,
  },
  description: {
    width: "50%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "left",
  },
  outstanding: {
    width: "20%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
  qty: {
    width: "10%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
});

export class SalesCollectionTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>{`Sales Collection`}</Text>
        <Text style={styles.outstanding}>{`Before Tax`}</Text>
        <Text style={styles.outstanding}>{`Amount`}</Text>
        <Text style={styles.qty}>{`Qty`}</Text>
      </View>
    );
  }
}
