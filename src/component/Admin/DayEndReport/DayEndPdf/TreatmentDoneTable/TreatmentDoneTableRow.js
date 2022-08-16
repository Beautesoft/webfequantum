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
    width: "15%",
    borderRightColor: backColor,
    textAlign: "left",
    marginRight: 10,
    marginLeft: 10,
  },
  outstanding: {
    width: "9%",
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
  outlet: {
    width: "7%",
    textAlign: "left",
    marginRight: 10,
  },
});
export class TreatmentDoneTableRow extends React.Component {
  render() {
    let { items } = this.props;

    return items.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.otherText}>
          {item.cust_name ? item.cust_name : ""}
        </Text>
        <Text style={styles.otherText}>
          {item.cust_code ? item.cust_code : ""}
        </Text>
        <Text style={styles.otherText}>
          {item.cust_refer ? item.cust_refer : ""}
        </Text>
        <Text style={styles.otherText}>
          {item.treatment_done ? item.treatment_done : ""}
        </Text>
        <Text style={styles.description}>{item.desc ? item.desc : ""}</Text>
        <Text style={styles.otherText}>
          {item.staff_name ? item.staff_name : ""}
        </Text>
        <Text style={styles.outlet}>
          {item.buy_treatment_outlet ? item.buy_treatment_outlet : ""}
        </Text>
        <Text style={styles.outlet}>
          {item.treatmentdone_outlet ? item.treatmentdone_outlet : ""}
        </Text>
        <Text style={styles.outstanding}>
          {item.amount ? item.amount : "0.00"}
        </Text>
      </View>
    ));
  }
}
