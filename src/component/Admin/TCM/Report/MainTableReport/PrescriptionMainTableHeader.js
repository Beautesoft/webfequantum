import React from "react";
import { Text, View, StyleSheet, Ellipse } from "@react-pdf/renderer";
import { withTranslation } from "react-i18next";

const borderColor = "#9e9e9e";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 55,
    textAlign: "center",
    fontSize: "10px",
    fontWeight: 500,
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
  },
  description: {
    width: "24%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  date: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },

  qty: {
    width: "6%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    marginRight: 10,
  },

  sno: {
    width: "5%",
    borderRightColor: borderColor,
    marginRight: 10,
    borderRightWidth: 1,
    textAlign: "center",
  },
  group: {
    width: "7%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  remarks: {
    width: "17%",
  },
});

export class PrescriptionMainTableHeaderClass extends React.Component {
  render() {
    let { t } = this.props;
    return (
      <View style={styles.container} fixed>
        <Text style={styles.sno}>{`编号 S.No`}</Text>
        <Text style={styles.group}>{`组别 Group`}</Text>
        <Text style={styles.group}>{`位置 Position`}</Text>
        <Text style={styles.description}>{`药名 Drug Name`}</Text>
        <Text style={styles.qty}>{`数量 Qty.`}</Text>
        <Text style={styles.qty}>{`总量 Total`}</Text>
        <Text style={styles.qty}>{`单位 UOM`}</Text>
        <Text style={styles.qty}>{`天数 Days`}</Text>
        <Text style={styles.qty}>{`零售 Retail`}</Text>
        <Text style={styles.remarks}>{`注释 Remark`}</Text>
      </View>
    );
  }
}

export const PrescriptionMainTableHeader = withTranslation()(
  PrescriptionMainTableHeaderClass
);
