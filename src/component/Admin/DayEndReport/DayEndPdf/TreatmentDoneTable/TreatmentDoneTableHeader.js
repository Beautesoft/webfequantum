import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const backColor = "#3c4087";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: backColor,
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 30,
    textAlign: "center",
    color: "#fff",
    flexGrow: 1,
    fontSize: "10px",
    backgroundColor: backColor,
  },
  description: {
    width: "15%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "left",
  },
  outstanding: {
    width: "9%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "right",
  },
  otherText: {
    width: "12%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "left",
  },
  outlet: {
    width: "7%",
    borderRightColor: backColor,
    borderRightWidth: 1,
    marginRight: 10,
    textAlign: "left",
  },
});

export class TreatmentDoneTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.otherText}>{`Customer`}</Text>
        <Text style={styles.otherText}>{`Customer Code`}</Text>
        <Text style={styles.otherText}>{`Cust Reference`}</Text>
        <Text style={styles.otherText}>{`Treatment Done`}</Text>
        <Text style={styles.description}>{`Desc`}</Text>
        <Text style={styles.otherText}>{`Staff`}</Text>
        <Text style={styles.outlet}>{`Purchase Outlet`}</Text>
        <Text style={styles.outlet}>{`TD Outlet`}</Text>
        <Text style={styles.outstanding}>{`Amount`}</Text>
      </View>
    );
  }
}
