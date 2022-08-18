import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "stretch",
    fontSize: "11px",
    margin: 10,
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: "grey",
  },
  headerModifiedText: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "70%",
  },
  headerAlterText: {
    width: "30%",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  headerNormalText: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "40%",
  },
  headerText: {
    width: "60%",
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

export class ReceiptBalance extends React.Component {
  render() {
    let { headerInfoDetail } = this.props;
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.headerModifiedText}>
            <Text style={styles.leftlabel}>诊所收据 Receipt</Text>
          </View>

          <View style={styles.headerAlterText}>
            <Text style={styles.rightvalue}>
              {headerInfoDetail.prescriptionNo}{" "}
            </Text>
          </View>
        </View>
        <View style={styles.borderStyle}>
          <View style={styles.container}>
            <View style={styles.headerNormalText}>
              <Text style={styles.leftlabel}>客户名 (Bill To):</Text>
            </View>

            <View style={styles.headerText}>
              <Text style={styles.rightvalue}>{headerInfoDetail.custName}</Text>
            </View>
          </View>
        </View>
        <View style={styles.borderStyle}>
          <View style={styles.container}>
            <View style={styles.headerNormalText}>
              <Text style={styles.leftlabel}>IC No :</Text>
            </View>

            <View style={styles.headerText}>
              <Text style={styles.rightvalue}>{headerInfoDetail.custNRIC}</Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.headerNormalText}>
              <Text style={styles.leftlabel}>诊疗时间 / Treatment Time :</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.rightvalue}>
                {headerInfoDetail.prescriptionDate}
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.headerNormalText}>
              <Text style={styles.leftlabel}>
                医师/理疗师 / Physician/Therapist :
              </Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.rightvalue}>
                {headerInfoDetail.staffName}
              </Text>
            </View>
          </View>

          {Number(headerInfoDetail.paymentBalance) > 0 ? (
            <>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    医嘱 / Physician's Instruction :
                  </Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    {headerInfoDetail.remark}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    疗程配套 / Treatment Package :
                  </Text>
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    {headerInfoDetail.TreatmentPackage}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    配套持有人 / Patient Name :
                  </Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    {headerInfoDetail.custName}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    本次疗程 / Treatment No :
                  </Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    {headerInfoDetail.treatmentNo}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>费用 / Fee :</Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    ${headerInfoDetail.totalAmountPayable}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    疗程余额 / Package Balance:
                  </Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    ${headerInfoDetail.packageBalance}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>本期付款 / Payment:</Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    ${headerInfoDetail.paymentBalance}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    服药天数 / Duration of Consumption :
                  </Text>
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    {headerInfoDetail.daysToTakeMedicine}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    服药时间 / Timing of Consumption :
                  </Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    {headerInfoDetail.timeToTakeMedicine}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    本次疗程 / Treatment No :
                  </Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    {headerInfoDetail.treatmentNo}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    服法 / Dosing Instruction :
                  </Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    {headerInfoDetail.waysToTakeMedicine}
                  </Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.headerNormalText}>
                  <Text style={styles.leftlabel}>
                    医嘱 / Physician's Instruction :
                  </Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.rightvalue}>
                    {headerInfoDetail.remark}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
        <View style={styles.borderStyle}>
          <View style={styles.container}>
            <View style={styles.headerNormalText}>
              <Text style={styles.leftlabel}>费用列表 (Charges):</Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.headerNormalText}>
              <Text style={styles.leftlabel}>门诊费 (Consultation Fee):</Text>
            </View>

            <View style={styles.headerText}>
              <Text style={styles.rightvalue}>
                ${headerInfoDetail.consultationFee}
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.headerNormalText}>
              <Text style={styles.leftlabel}>针灸费 (Acupuncture Fee):</Text>
            </View>

            <View style={styles.headerText}>
              <Text style={styles.rightvalue}>
                ${headerInfoDetail.acutpuntureFee}
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.headerNormalText}>
              <Text style={styles.leftlabel}>药费 (Medications Fee):</Text>
            </View>

            <View style={styles.headerText}>
              <Text style={styles.rightvalue}>
                ${headerInfoDetail.drugAmount}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderStyle}>
          {Number(headerInfoDetail.paymentBalance) > 0 ? (
            <View style={styles.container}>
              <View style={styles.headerNormalText}>
                <Text style={styles.leftlabel}>顾客签名 (Signature):</Text>
              </View>

              <View style={styles.headerText}>
                <Text style={styles.rightvalue}></Text>
              </View>
            </View>
          ) : (
            <View style={styles.container}>
              <View style={styles.headerModifiedText}>
                <Text style={styles.leftlabel}>
                  收费 Total Amount Paid: ${headerInfoDetail.totalAmountPayable}
                </Text>
              </View>

              <View style={styles.headerAlterText}>
                <Text style={styles.rightvalue}>收款员 Cashier: </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
export default ReceiptBalance;
