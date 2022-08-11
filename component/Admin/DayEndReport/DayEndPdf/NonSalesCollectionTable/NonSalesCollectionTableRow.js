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
    width: "70%",
    borderRightColor: backColor,
    textAlign: "left",
    marginRight: 10,
    marginLeft: 10,
  },
  outstanding: {
    width: "20%",
    borderRightColor: backColor,
    textAlign: "right",
    marginRight: 10,
  },
  qty: {
    width: "10%",
    textAlign: "right",
    marginRight: 10,
  },
});
export class NonSalesCollectionTableRow extends React.Component {
  render() {
    let { items } = this.props;

    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.description}>{item.desc ? item.desc : ""}</Text>
        <Text style={styles.outstanding}>
          {item.amount ? item.amount : "0.00"}
        </Text>
        <Text style={styles.qty}>{item.qty ? item.qty : 0}</Text>
      </View>
    ));
  }
}
