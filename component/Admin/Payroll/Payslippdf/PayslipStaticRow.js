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
    width: "40%",
    borderRightColor: backColor,
    textAlign: "left",
    marginRight: 10,
    marginLeft: 10,
  },
  outstanding: {
    width: "60%",
    borderRightColor: backColor,
    textAlign: "right",
    marginRight: 10,
  },
});
export class PayslipStaticRow extends React.Component {
  render() {
    let { value, Label } = this.props;

    return (
      <View style={styles.row}>
        <Text style={styles.description}>{Label ? Label : ""}</Text>
        <Text style={styles.outstanding}>
          {value ? Number(value).toFixed(2) : ""}
        </Text>
      </View>
    );
  }
}
