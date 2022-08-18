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
    width: 70,
    alignSelf: "flex-start",
    textAlign: "left",

  },
  leftvalue: {
    alignSelf: "flex-end",
    textAlign: "left",
  },
  rightlabel: {
    width: 70,
    textAlign: "left",

  },
  rightvalue: {
    maxWidth: 100,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    textAlign: "left",
  },
});

export class AccountDetailInfo extends React.Component {
  render() {
    let { accountHeader } = this.props;
    let now = new Date();
    var PrintedDate = moment(now).format("DD-MM-YYYY");
    var PrintedTime = moment(now).format("HH:MM:SS");
    return (
      <View style={styles.container}>
        <View style={styles.headerNormalText}>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Name</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>{accountHeader.cust_name}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Transaction #</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>
              {accountHeader.sa_transacno_ref}
            </Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Treatment #</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>
              {accountHeader.treatparent_code}
            </Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>Credit</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>
              ${accountHeader.credit_balance}
            </Text>
          </View>
        </View>
        <View style={styles.headerText}>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Outstanding</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>
              ${accountHeader.outstanding_balance}
            </Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Printed Date</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{PrintedDate}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Printed Time</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{PrintedTime}</Text>
          </View>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.rightlabel}>Printed By</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.rightvalue}>{accountHeader.issued}</Text>
          </View>
        </View>
      </View>
    );
  }
}
