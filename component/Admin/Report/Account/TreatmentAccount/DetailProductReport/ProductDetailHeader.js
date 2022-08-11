import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 30,
    textAlign: "center",
    flexGrow: 1,
    fontSize: "10px",
  },
  description: {
    width: "35%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  date: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  type: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
});

export class ProductDetailHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.date}>{`Date`}</Text>
        <Text style={styles.description}>{`Transaction #`}</Text>
        <Text style={styles.type}>{`Treatment #`}</Text>
        <Text style={styles.type}>{`Payment`}</Text>
        <Text style={styles.type}>{`Credit`}</Text>
        <Text style={styles.type}>{`Outstanding`}</Text>
      </View>
    );
  }
}
