import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const backColor = "#3c4087";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: backColor,
    borderBottomWidth: 1,
    minHeight: 20,
    maxHeight: 35,
    flexGrow: 1,
    fontSize: "10px",
    alignItems: "center",
  },
  description: {
    width: "50%",
    borderRightColor: backColor,
    textAlign: "left",
    marginRight: 10,
    marginLeft: 10,
  },
  outstanding: {
    width: "50%",
    marginRight: 10,
    textAlign: "right",
  },
});
export class PayslipTableRow extends React.Component {
  render() {
    let { TableList } = this.props;

    return TableList.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.description}>{item.desc ? item.desc : ""}</Text>
        <Text style={styles.outstanding}>
          {item.amount ? Number(item.amount).toFixed(2) : ""}
        </Text>
      </View>
    ));
  }
}
