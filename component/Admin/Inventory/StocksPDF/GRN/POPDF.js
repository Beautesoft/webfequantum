import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "stretch",
    fontSize: "10px",
  },
  headerNormalText: {
    flexDirection: "column",
    justifyContent: "flex-start",
    flexGrow: 5,
  },

  headerText: {
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  invoiceNoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
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
    alignSelf: "flex-end",
    textAlign: "left",
  },
  rightlabel: {
    width: 80,
    textAlign: "left",
  },
  rightlabelWidth: {
    width: 100,
    textAlign: "left",
  },
  rightvalue: {
    minWidth: 60,
    maxWidth: 100,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    textAlign: "left",
  },
});

export class PODetails extends React.Component {
  render() {
    let { listDetail } = this.props;
    let now = new Date();
    var PrintedDate = moment(now).format("DD-MM-YYYY");
    var PrintedTime = moment(now).format("HH:MM:SS");
    return (
      <View style={styles.container}>
        <View style={styles.headerNormalText}>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>GRN NO</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{listDetail.DOC_NO}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Supplier</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{listDetail.Supplier}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Date</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{listDetail.DOC_DATE}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Created By</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{listDetail.CREATE_USER}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>GR1 Reference</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{listDetail.DOC_REF1}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>GR2 Reference</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{listDetail.DOC_REF2}</Text>
          </View>
        </View>

        <View style={styles.headerText}>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Print Date</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{PrintedDate}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Print Time</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{PrintedTime}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Printed By</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{listDetail.printedBy}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export class POTotal extends React.Component {
  render() {
    let { listDetail } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.headerText}>
          <View style={styles.invoiceDateContainer}>
            <Text style={styles.rightlabelWidth}>Total Quantity</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{listDetail.totalQty}</Text>
          </View>
          <View style={styles.invoiceDateContainer}>
            <Text style={styles.rightlabelWidth}>Total Amount</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{listDetail.totalAmt}</Text>
          </View>
        </View>
      </View>
    );
  }
}
