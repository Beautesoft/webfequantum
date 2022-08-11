import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const PrescriptionFooter = () => (
  <Text
    style={styles.pageNumber}
    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
  />
);

export default PrescriptionFooter;
