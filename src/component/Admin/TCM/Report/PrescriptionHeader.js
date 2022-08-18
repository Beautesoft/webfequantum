import React from "react";
import { Text, View, StyleSheet, Link, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    bottom: 10,
    top: 0.5,
  },
  headerNormalText: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "50%",
  },
  headerText: {
    width: "50%",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  leftlabel: {
    alignSelf: "flex-start",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
  },

  rightvalue: {
    textAlign: "left",
  },
});

export class PrescriptionHeader extends React.Component {
  render() {
    let { accountHeader } = this.props;
    return (
      <View style={styles.container} fixed>
        <View style={styles.container}>
          <View style={styles.headerNormalText}>
            <Text style={styles.leftlabel}>
              处方药单 Prescription Drug List
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.rightvalue}>
              SL. No: {accountHeader.prescriptionNo}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default PrescriptionHeader;
