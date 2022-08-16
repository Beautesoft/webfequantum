import React, { Fragment } from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";
const borderColor = "#90e5fc";
Font.registerHyphenationCallback(ss => {
  const middle = Math.floor(ss.length / 2);
  const parts =
    ss.length === 1 ? [ss] : [ss.substr(0, middle), ss.substr(middle)];

  // Check console to see words parts
  console.log(ss, parts);

  return parts;
});
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    flexGrow: 1,
    fontSize: "9px",
    alignItems: "center",
    height: 50,
  },
  description: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  date: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  purchase: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  status: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  type: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  prepaid: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  payment: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
  },
});

export class PrepaidTable extends React.Component {
  render() {
    let { items } = this.props;
    let ss = items;
    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.prepaid}>{item.prepaid}</Text>
        <Text style={styles.prepaid}>{item.pp_no}</Text>
        <Text style={styles.description}>{item.pp_desc}</Text>
        <Text style={styles.date}>{item.last_update}</Text>
        <Text style={styles.purchase}>{item.sa_date}</Text>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.status}>{item.exp_date}</Text>
        <Text style={styles.status}>{item.exp_status}</Text>
        <Text style={styles.payment}>{item.pp_total}</Text>
        <Text style={styles.payment}>{item.topup_amt}</Text>
      </View>
    ));
  }
}
