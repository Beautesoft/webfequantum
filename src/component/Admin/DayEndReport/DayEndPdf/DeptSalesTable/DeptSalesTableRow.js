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
    width: "30%",
    borderRightColor: backColor,
    textAlign: "right",
    marginRight: 10,
  },
});
export class DeptSalesTableRow extends React.Component {
  render() {
    let { items } = this.props;
    return (
      items &&
      items.map((item, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.description}>
            {item.dept_sales ? item.dept_sales : ""}
          </Text>
          <Text style={styles.outstanding}>
            {item.amount ? item.amount : ""}
          </Text>
        </View>
      ))
    );
  }
}
