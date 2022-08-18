import React from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";
Font.registerHyphenationCallback(word => {
  const middle = Math.floor(word.length / 2);
  const parts =
    word.length === 1 ? [word] : [word.substr(0, middle), word.substr(middle)];

  // Check console to see words parts
  console.log(word, parts);

  return parts;
});
const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 31,
    textAlign: "center",
    flexGrow: 1,
    fontSize: "10px",
  },
  description: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  date: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  purchase: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  status: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  type: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  prepaid: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  payment: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
});

export class PrepaidTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.prepaid}>{`Prepaid #`}</Text>
        <Text style={styles.prepaid}>{`Payment #`}</Text>
        <Text style={styles.description}>{`Description`}</Text>
        <Text style={styles.date}>{`Last Update`}</Text>
        <Text style={styles.purchase}>{`Purchase Date`}</Text>
        <Text style={styles.type}>{`Type`}</Text>
        <Text style={styles.status}>{`Expiry Date`}</Text>
        <Text style={styles.status}>{`Expiry Status`}</Text>
        <Text style={styles.payment}>{`Prepaid`}</Text>
        <Text style={styles.payment}>{`Balance`}</Text>
      </View>
    );
  }
}
