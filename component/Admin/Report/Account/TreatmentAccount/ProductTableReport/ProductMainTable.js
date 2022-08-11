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

  text: {
    width: "35%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    marginLeft: 10,
  },
  date: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },

  transaction: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  outstanding: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },
});
export class ProductMainTable extends React.Component {
  render() {
    let { items } = this.props;
    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.date}>{item.sa_date}</Text>
        <Text style={styles.transaction}>{item.transaction}</Text>
        <Text style={styles.text}>{item.item_description}</Text>
        <Text style={styles.outstanding}>{item.balance}</Text>
        <Text style={styles.outstanding}>{item.outstanding}</Text>
        <Text style={styles.outstanding}>{item.qty}</Text>
        <Text style={styles.date}>{item.item_status}</Text>
      </View>
    ));
  }
}
