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

import allfont from "../../../../assets/fonts/ZCOOL_XiaoWei/ZCOOLXiaoWei-Regular.ttf";

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
    fontSize: 12,
    marginTop: 10,
    textAlign: "left",
    fontFamily: "ZCOOL XiaoWei",
    paddingTop: 15,
    marginTop: 15,
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

class MedicalCertificate extends React.Component {
  render() {
    let { HeaderDetail, landscape, CertificateData } = this.props;
    console.log(CertificateData, "responapicertificate");
    return (
      <Document>
        {CertificateData.length > 0 &&
          CertificateData.map((item, index) => (
            <Page
              key={index}
              style={styles.body}
              size="A4"
              orientation={landscape ? "landscape" : "portrait"}
            >
              <Text style={styles.title} fixed>
                {HeaderDetail.siteHeader}
              </Text>
              <Text style={styles.secondTitle} fixed>
                {HeaderDetail.siteAddress}
              </Text>
              <View style={styles.container}>
                <View style={styles.columnOneHalf}>
                  <Text style={styles.text}>
                    Medical Certificate / 医疗证书
                  </Text>
                </View>
                <View style={styles.columnTwo}>
                  <Text style={styles.subtitle}>
                    Serial number / 编号 :{item.medicalCertificateNo}
                  </Text>
                  <Text style={styles.subtitle}>
                    Date / 日期 : {item.medicalCertificateDate}
                  </Text>
                </View>
              </View>
              <Text style={styles.texttitle}>
                This is to certify that {item.custName}
              </Text>
              <Text style={styles.texttitle}>
                NRIC / 身份证: {item.custNRIC}
              </Text>
              <Text style={styles.texttitlejustify}>
                This is to certify that {item.custName} visited the clinic on{" "}
                {item.diagnoseDate} at {item.diagnoseTime} and is to be given to
                Days / 天 {item.noOfDays} of sick leave from {item.fromDate} to{" "}
                {item.toDate}
              </Text>
              <Text style={styles.texttitle}>Remarks / 评论</Text>
              <Text style={styles.subtitle}>{item.reason}</Text>

              <View style={styles.footer}>
                <View style={styles.container}>
                  <View style={styles.columnOneHalf}>
                    <Text style={styles.text}></Text>
                  </View>
                  <View style={styles.columnTwo}>
                    <Image
                      style={styles.image}
                      src={item.staffSignString ? item.staffSignString : null}
                    />
                    <Text style={styles.subtitle}>
                      TCM Physician : {item.staffName}
                    </Text>
                  </View>
                </View>
                <View style={styles.container}>
                  <View style={styles.columnOne}>
                    <Text style={styles.textStamp}></Text>
                    <Text style={styles.subtitle}>Clinic's Stamp</Text>
                  </View>
                  <View style={styles.columnTwo}>
                    <Text style={styles.text}></Text>
                  </View>
                </View>

                <Text style={styles.texttitlejustify}>
                  This Certificate is not valid for absence from court or other
                  judicial proceedings unless specifically stated
                </Text>
              </View>
            </Page>
          ))}
      </Document>
    );
  }
}
export default MedicalCertificate;
