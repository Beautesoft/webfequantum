import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

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
    flexGrow: 5,
  },

  headerText: {
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "flex-end",
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
  rightvalue: {
    minWidth: 60,
    maxWidth: 100,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    textAlign: "left",
  },
});

export class ManualInvoiceMainInfo extends React.Component {
  render() {
    let { accountHeader, Flag } = this.props;
    let now = new Date();
    var PrintedDate = moment(now).format("DD-MM-YYYY");
    var PrintedTime = moment(now).format("HH:MM:SS");
    return (
      <View style={styles.container}>
        <View style={styles.headerNormalText}>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Invoice No.</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>
              {Flag == 8
                ? accountHeader.workorderinv_number
                : accountHeader.manualinv_number}
                {Flag == 10
                ? accountHeader.quotation_number
                : ""}
            </Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Invoice Date</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>
              {moment(accountHeader.created_at).format("DD-MM-YYYY")}
            </Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Status</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{accountHeader.status}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Project</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{accountHeader.title}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Validity</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{accountHeader.validity}</Text>
          </View>
        </View>
        <View style={styles.headerText}>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Terms</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{accountHeader.terms}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Company Name</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{accountHeader.company}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Attn To</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>
              {accountHeader.contact_person}
            </Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Prepared By</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{accountHeader.in_charge}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Printed On</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>
              {PrintedDate}
              {` `} {PrintedTime}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
