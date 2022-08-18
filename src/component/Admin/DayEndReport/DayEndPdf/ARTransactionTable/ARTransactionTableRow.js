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
    width: "40%",
    borderRightColor: backColor,
    textAlign: "left",
    marginRight: 10,
    marginLeft: 10,
  },
  codeText: {
    width: "15%",
    borderRightColor: backColor,
    textAlign: "left",
    marginRight: 10,
  },
  amount: {
    width: "15%",
    textAlign: "right",
    marginRight: 10,
  },
});
export class ARTransactionTableRow extends React.Component {
  render() {
    let { items } = this.props;

    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.codeText}>
          {item.satransac_ref ? item.satransac_ref : ""}
        </Text>
        <Text style={styles.codeText}>
          {item.cust_code ? item.cust_code : ""}
        </Text>
        <Text style={styles.codeText}>
          {item.cust_name ? item.cust_name : ""}
        </Text>
        <Text style={styles.description}>{item.desc ? item.desc : ""}</Text>
        <Text style={styles.amount}>{item.amount ? item.amount : "0.00"}</Text>
      </View>
    ));
  }
}
