import React from "react";
import {
  Page,
  Document,
  Image,
  StyleSheet,
  Text,
  Font,
  Svg,
  Polyline,
  View,
} from "@react-pdf/renderer";
// import InvoiceItemsTable from "./InvoiceItemsTable";
// import logo from "assets/images/logo.png";
// import CustomerHeader from "./CustomerHeader";
// import CustomerFooter from "./CustomerFooter";

// import { AccountMainInfo, AccountDetailInfo ,ProductMainInfo, ProductDetailMain } from "./TreatmentAccount";
// import { PrepaidInfo } from "./TreatmentAccount";
import { PODetails } from "./POPDF";
import { Header } from "./header";
import { POTable } from "./POTable";
import { POTableHeader } from "./POTableHeader";

import allfont from "assets/fonts/ZCOOL_XiaoWei/ZCOOLXiaoWei-Regular.ttf";

Font.register({
  family: "ZCOOL XiaoWei",
  src: allfont,
});
const styles = StyleSheet.create({
  page: {
    fontFamily: "ZCOOL XiaoWei",
    fontSize: 11,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    lineHeight: 1.5,
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
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#bff0fd",
    fontSize: "10px",
  },
  invoiceNoContainer: {
    marginTop: 24,
    marginLeft: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  leftlabel: {
    fontSize: 12,
    fontWeight: 900,
    width: 40,
    alignSelf: "flex-start",
    textAlign: "left",
  },
  leftrow: {
    fontSize: 12,
    fontWeight: 900,
    width: 1000,
    alignSelf: "flex-start",
    textAlign: "left",
  },
  leftvalue: {
    alignSelf: "flex-end",
    textAlign: "left",
  },
  label: {
    alignSelf: "flex-start",
  },
});
export class PDF extends React.Component {
  render() {
    let { reportSummaryList, summary, landscape, blur } = this.props;
    console.log(reportSummaryList, "reportSummaryList");
    console.log(summary, "summary");
    return (
      <Document file="somefile.pdf">
        <Page
          size="A4"
          orientation={landscape ? "landscape" : "portrait"}
          style={styles.page}
        >
          <Header summary={summary} />

          <Svg height="10" width="775">
            <Polyline points="0,10 775,10" stroke="black" strokeWidth={2} />
          </Svg>

          <PODetails summary={summary} />

          <Svg height="10" width="775">
            <Polyline points="0,10 775,10" stroke="black" strokeWidth={2} />
          </Svg>

          <View style={styles.tableContainer}>
            <POTableHeader />
            <POTable reportSummaryList={reportSummaryList} blur={blur} />
          </View>

          {/* <POTotal summary={summary} blur={blur}/> */}

          <Svg height="10" width="775">
            <Polyline points="0,10 775,10" stroke="black" strokeWidth={2} />
          </Svg>
        </Page>
      </Document>
    );
  }
}
export default PDF;
