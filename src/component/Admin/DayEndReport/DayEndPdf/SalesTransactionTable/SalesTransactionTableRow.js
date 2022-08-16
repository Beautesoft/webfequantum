import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const backColor = "#3c4087";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: backColor,
    borderBottomWidth: 1,
    minHeight: 30,
    flexGrow: 1,
    fontSize: "10px",
    alignItems: "center",
  },

  description: {
    width: "18%",
    borderRightColor: backColor,
    textAlign: "left",
    marginRight: 10,
    marginLeft: 10,
  },
  outstanding: {
    width: "8%",
    borderRightColor: backColor,
    textAlign: "right",
    marginRight: 10,
  },
  otherText: {
    width: "12%",
    borderRightColor: backColor,
    textAlign: "left",
    marginRight: 10,
  },
  qty: {
    width: "6%",
    textAlign: "right",
    marginRight: 10,
  },
});
export class SalesTransactionTableRow extends React.Component {
  render() {
    let { items } = this.props;

    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.otherText}>
          {item.satransac_ref ? item.satransac_ref : ""}
        </Text>
        <Text style={styles.otherText}>
          {item.cust_code ? item.cust_code : ""}
        </Text>
        <Text style={styles.otherText}>
          {item.cust_name ? item.cust_name : ""}
        </Text>
        <Text style={styles.description}>{item.desc ? item.desc : ""}</Text>
        <Text style={styles.qty}>{item.qty ? item.qty : 0}</Text>
        <Text style={styles.outstanding}>{item.amt ? item.amt : "0.00"}</Text>
        <Text style={styles.outstanding}>
          {item.balance ? item.balance : "0.00"}
        </Text>
        <Text style={styles.outstanding}>
          {item.amount ? item.amount : "0.00"}
        </Text>
        <Text style={styles.outstanding}>{item.paid ? item.paid : "0.00"}</Text>
        <Text style={styles.outstanding}>
          {item.outstanding ? item.outstanding : "0.00"}
        </Text>
      </View>
    ));
  }
}
