import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    minHeight: 30,
    flexGrow: 1,
    fontSize: "9px",
    alignItems: "center",
  },
  description: {
    width: "35%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  date: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  type: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
});

export class ProductDetailTable extends React.Component {
  render() {
    let { items } = this.props;
    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.date}>{item.sa_date}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.type}>$ {item.payment}</Text>
        <Text style={styles.type}>$ {item.balance}</Text>
        <Text style={styles.type}>$ {item.outstanding}</Text>
      </View>
    ));
  }
}
