import React from "react";
import {
  Page,
  Document,
  Image,
  StyleSheet,
  Text,
  Font,
  View,
} from "@react-pdf/renderer";
import moment from "moment";

import allfont from "../../../../assets/fonts/ZCOOL_XiaoWei/ZCOOLXiaoWei-Regular.ttf";

import { PayslipHeader } from "./PayslipHeader";
import { PayslipSingleLineHeader } from "./PayslipSingleLineHeader";
import { PayslipTableRow } from "./PayslipTableRow";
import { PayslipStaticRow } from "./PayslipStaticRow";

Font.register({
  family: "ZCOOL XiaoWei",
  src: allfont,
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "ZCOOL XiaoWei",
    paddingBottom: 5,
  },
  secondTitle: {
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center",
    fontFamily: "ZCOOL XiaoWei",
    borderBottom: 1,
    borderBottomColor: "grey",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "left",
    fontFamily: "ZCOOL XiaoWei",
    marginTop: 5,
  },
  texttitle: {
    fontSize: 10,
    marginBottom: 5,
    textAlign: "left",
    fontFamily: "ZCOOL XiaoWei",
    paddingTop: 2,
    paddingBottom: 5,
    marginTop: 3,
  },
  texttitleheader: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "ZCOOL XiaoWei",
    paddingTop: 2,
    paddingBottom: 5,
    marginTop: 3,
  },
  texttitlejustify: {
    fontSize: 12,
    marginTop: 10,
    textAlign: "justify",
    fontFamily: "ZCOOL XiaoWei",
    paddingTop: 10,
    lineHeight: 1.5,
  },
  text: {
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "ZCOOL XiaoWei",
    paddingTop: 5,
  },
  textStamp: {
    fontSize: 14,
    textAlign: "left",
    fontFamily: "ZCOOL XiaoWei",
    borderTop: 1,
    borderTopColor: "grey",
  },
  image: {
    width: 100,
    height: 30,
    textAlign: "center",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  columnOne: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "30%",
  },
  columnOneHalf: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "50%",
  },

  columnTwo: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "40%",
  },
  container: {
    flexDirection: "row",
    paddingTop: "5px",
  },
  footer: {
    position: "absolute",
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontSize: 12,
    bottom: 225,
    left: 0,
    right: 0,
    textAlign: "center",
  },
});
// EmpName,
// FromDate,
// toDate,
// BasicSalary,
// hourlySalHour,
// hourlySalRate,
// firstOverTimeRate,
// firstOverTimeHour,
// totOTPay,
// totCommission,
// totAllowance,
// totDeduct,
// AddPay,
// netPay,
// empCPFCont,
// dateofPay,
// modeofPay,
// secondOverTimeHour,
// secondOverTimeRate,

class Payslip extends React.Component {
  render() {
    let { MainInfo } = this.props;

    return (
      <Document>
        {MainInfo.length > 0 &&
          MainInfo.map((MainInfo, index) => (
            <Page
              key={index}
              style={styles.body}
              size="A4"
              orientation={"portrait"}
            >
              {/* <Text style={styles.title} fixed>
                {HeaderDetail.siteHeader}
              </Text>
              <Text style={styles.secondTitle} fixed>
                {HeaderDetail.siteAddress}
              </Text> */}
              <Text style={styles.texttitleheader}>
                Payslip for{" "}
                {MainInfo && MainInfo.FromDate
                  ? moment(MainInfo.FromDate).format("DD-MM-YYYY")
                  : ""}{" "}
                to{" "}
                {MainInfo && MainInfo.toDate
                  ? moment(MainInfo.toDate).format("DD-MM-YYYY")
                  : ""}{" "}
              </Text>
              <View style={styles.container}>
                <PayslipSingleLineHeader columnLabel={`Name of the Employer`} />
              </View>
              <Text style={styles.texttitle}>
                {MainInfo.company_name && MainInfo.company_name
                  ? MainInfo.company_name
                  : ""}
              </Text>

              <View style={styles.container}>
                <PayslipSingleLineHeader columnLabel={`Name of the Employee`} />
              </View>
              <Text style={styles.texttitle}>
                {MainInfo && MainInfo.EmpName ? MainInfo.EmpName : ""}
              </Text>
              <View style={styles.container}>
                <PayslipHeader firstColumn={`Item`} secondColumn={`Amount`} />
              </View>
              <View style={styles.container}>
                <PayslipStaticRow
                  Label={`Basic Pay`}
                  value={
                    MainInfo && MainInfo.BasicSalary
                      ? MainInfo.BasicSalary
                      : "0.00"
                  }
                />
              </View>

              <View style={styles.container}>
                <PayslipStaticRow
                  Label={`Total Allowances`}
                  subLabel={`breakdown shown below`}
                  value={
                    MainInfo && MainInfo.totAllowance
                      ? MainInfo.totAllowance
                      : "0.00"
                  }
                />
              </View>
              {MainInfo.TotAllowanceList &&
                MainInfo.TotAllowanceList.length > 0 && (
                  <PayslipTableRow TableList={MainInfo.TotAllowanceList} />
                )}
              <View style={styles.container}>
                <PayslipStaticRow
                  Label={`Total Deductions`}
                  subLabel={`breakdown shown below`}
                  value={
                    MainInfo && MainInfo.totDeduct ? MainInfo.totDeduct : "0.00"
                  }
                />
              </View>
              <View style={styles.container}>
                <PayslipStaticRow
                  Label={`Employee's CPF deduction`}
                  subLabel={`breakdown shown below`}
                  value={
                    MainInfo && MainInfo.totDeduct ? MainInfo.totDeduct : "0.00"
                  }
                />
              </View>
              <View style={styles.container}>
                {MainInfo.TotDeductionList &&
                  MainInfo.TotDeductionList.length > 0 && (
                    <PayslipTableRow TableList={MainInfo.TotDeductionList} />
                  )}
              </View>

              <View style={styles.container}>
                <PayslipSingleLineHeader columnLabel={`Date of Payment`} />
              </View>
              <Text style={styles.texttitle}>
                {MainInfo && MainInfo.dateofPay
                  ? moment(MainInfo.dateofPay).format("DD-MM-YYYY")
                  : ""}
              </Text>
              <View style={styles.container}>
                <PayslipSingleLineHeader columnLabel={`Mode of Payment`} />
              </View>
              <Text style={styles.texttitle}>
                {MainInfo && MainInfo.modeofPayId_text
                  ? MainInfo.modeofPayId_text
                  : ""}
              </Text>

              <View style={styles.container}>
                <PayslipSingleLineHeader columnLabel={`Over time Details`} />
              </View>
              <View style={styles.container}>
                <PayslipStaticRow
                  Label={`Overtime Hours Worked`}
                  subLabel={``}
                  value={
                    MainInfo
                      ? Number(MainInfo.firstOverTimeHour) +
                        Number(MainInfo.secondOverTimeHour)
                      : "0"
                  }
                />
              </View>
              <View style={styles.container}>
                <PayslipStaticRow
                  Label={`Total Overtime Pay`}
                  subLabel={`breakdown shown below`}
                  value={
                    MainInfo && MainInfo.totOTPay ? MainInfo.totOTPay : "0.00"
                  }
                />
              </View>

              <View style={styles.container}>
                <PayslipHeader firstColumn={`Item`} secondColumn={`Amount`} />
              </View>
              <View style={styles.container}>
                <PayslipStaticRow
                  Label={`Others Additional Payments`}
                  subLabel={`(Breakdown shown below)`}
                  value={MainInfo && MainInfo.AddPay ? MainInfo.AddPay : "0.00"}
                />
              </View>

              <View style={styles.container}>
                {MainInfo.AddPaymentList &&
                  MainInfo.AddPaymentList.length > 0 && (
                    <PayslipTableRow TableList={MainInfo.AddPaymentList} />
                  )}
              </View>
              <View style={styles.container}>
                <PayslipStaticRow
                  Label={`Net Pay`}
                  subLabel={`breakdown shown below`}
                  value={MainInfo && MainInfo.netPay ? MainInfo.netPay : "0.00"}
                />
              </View>
              <View style={styles.container}>
                <PayslipStaticRow
                  Label={`Employer's CPF Contributions`}
                  subLabel={""}
                  value={
                    MainInfo && MainInfo.empCPFCont
                      ? MainInfo.empCPFCont
                      : "0.00"
                  }
                />
              </View>
            </Page>
          ))}
      </Document>
    );
  }
}
export default Payslip;
