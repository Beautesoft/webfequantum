import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";
const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "stretch",
    fontSize: "10px",
  },
  headerNormalText: {
    flexDirection: "column",
    justifyContent: "flex-start",
    flexGrow: 10,
  },

  headerText: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },

  invoiceNoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottom: "1px",
    borderBottomColor: borderColor,
  },
  invoiceDateContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    textAlign: "left",
  },

  label: {
    alignSelf: "flex-start",
  },
  value: {
    alignSelf: "flex-end",
  },
  leftlabel: {
    width: 80,
    alignSelf: "flex-start",
    textAlign: "left",
  },
  leftvalue: {
    alignSelf: "flex-start",
    textAlign: "left",
  },
  rightlabel: {
    width: 60,
    textAlign: "left",
  },
  rightvalue: {
    width: 80,
    textAlign: "right",
  },
});

export class ManualInvoiceSecondaryInfo extends React.Component {
  render() {
    let { accountHeader } = this.props;
    let now = new Date();
    var PrintedDate = moment(now).format("DD-MM-YYYY");
    var PrintedTime = moment(now).format("HH:MM:SS");
    return (
      <View style={styles.container}>
        <View style={styles.headerNormalText}>
          <Text style={styles.leftlabel}>Remarks</Text>
          <Text style={styles.label}> </Text>
          <Text style={styles.leftvalue}>{accountHeader.remarks}</Text>
        </View>
        <View style={styles.headerText}>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Shipping Cost</Text>
            <Text style={styles.label}> </Text>
            <Text style={styles.rightvalue}>{accountHeader.q_shipcost}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Discount</Text>
            <Text style={styles.label}> </Text>
            <Text style={styles.rightvalue}>{accountHeader.q_discount}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Taxes</Text>
            <Text style={styles.label}> </Text>
            <Text style={styles.rightvalue}>{accountHeader.q_taxes}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Total</Text>
            <Text style={styles.label}> </Text>
            <Text style={styles.rightvalue}>{accountHeader.q_total}</Text>
          </View>
        </View>
      </View>
    );
  }
}
