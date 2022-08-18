import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const CustomerFooter = () => (
  <Text
    style={styles.pageNumber}
    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
  />
);

export default CustomerFooter;
