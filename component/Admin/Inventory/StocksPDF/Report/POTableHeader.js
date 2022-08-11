import React from "react";
import { Text, View, StyleSheet,Font } from "@react-pdf/renderer";
Font.registerHyphenationCallback(word => {
  const middle = Math.floor(word.length/2);
  const parts = word.length === 1 ? [word] : [word.substr(0, middle), word.substr(middle)];

  // Check console to see words parts
  console.log(word, parts);

  return parts;
});;
const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    display:"flex",
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
    width: "30%",
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
  number: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  code: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  uom: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
});

export class POTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.code}>{`Item Code`}</Text>
        <Text style={styles.description}>{`Item Description`}</Text>
        <Text style={styles.uom}>{`Brand`}</Text>
        <Text style={styles.uom}>{`UOM`}</Text>
        <Text style={styles.number}>{`Quantity`}</Text>
        <Text style={styles.number}>{`Cost`}</Text>
        <Text style={styles.number}>{`Total`}</Text>
      </View>
    );
  }
}
