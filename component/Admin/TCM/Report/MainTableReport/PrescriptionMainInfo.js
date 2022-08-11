import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "stretch",
    fontSize: "10px",
  },
  headerNormalText: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "35%",
  },
  headerText: {
    width: "65%",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  leftlabel: {
    alignSelf: "flex-start",
    textAlign: "left",
  },

  rightvalue: {
    textAlign: "left",
  },
});

export class PrescriptionMainInfo extends React.Component {
  render() {
    let { accountHeader, SumQty, SumTotal } = this.props;

    return (
      <View>
        <View style={styles.container}>
          <View style={styles.headerNormalText}>
            <Text style={styles.leftlabel}>负责人 / Person In Charge :</Text>
            <Text style={styles.leftlabel}></Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.rightvalue}>{accountHeader.staffName}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.headerNormalText}>
            <Text style={styles.leftlabel}>患者姓名 / Patient name :</Text>
            <Text style={styles.leftlabel}></Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.rightvalue}>{accountHeader.custName}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.headerNormalText}>
            <Text style={styles.leftlabel}>IC No. :</Text>
            <Text style={styles.leftlabel}></Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.rightvalue}>{accountHeader.custNRIC}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.headerNormalText}>
            <Text style={styles.leftlabel}>诊病时间 / Consultation time :</Text>
            <Text style={styles.leftlabel}></Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.rightvalue}>
              {accountHeader.prescriptionDate}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.headerNormalText}>
            <Text style={styles.leftlabel}>
              服药天数 / Duration of Consumption :
            </Text>
            {/* <Text style={styles.leftlabel}>Duration of Consumption</Text> */}
          </View>

          <View style={styles.headerText}>
            <Text style={styles.rightvalue}>
              {accountHeader.daysToTakeMedicine} days
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.headerNormalText}>
            <Text style={styles.leftlabel}>服法 / Dosing Instruction :</Text>
            <Text style={styles.leftlabel}></Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.rightvalue}>
              {accountHeader.waysToTakeMedicine}
              {" / "}
              {accountHeader.timeToTakeMedicine}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.headerNormalText}>
            <Text style={styles.leftlabel}>
              医嘱 / Physician's Instruction :
            </Text>
            <Text style={styles.leftlabel}></Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.rightvalue}>{accountHeader.remark}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.headerNormalText}>
            <Text style={styles.leftlabel}>粉剂总量 / Total powder:</Text>
            <Text style={styles.leftlabel}></Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.rightvalue}>
              {SumTotal} ({SumQty})
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
