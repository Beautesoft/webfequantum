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

import logo from "assets/images/logo.png";
// import CustomerHeader from "./CustomerHeader";
// import CustomerFooter from "./CustomerFooter";

import allfont from "../../../../assets/fonts/ZCOOL_XiaoWei/ZCOOLXiaoWei-Regular.ttf";

import CustomerFooter from "component/Admin/Report/Account/CustomerFooter";
import SalesCollection from "./SalesCollection";
import { SalesCollectionMainInfo } from "./SalesCollectionMainInfo";
import DeptSales from "./DeptSales";
import { DeptSalesTableHeader } from "./DeptSalesTable";
import { NonSalesCollection } from "./NonSalesCollection";
import ARTransaction from "./ARTransaction";
import SalesTransaction from "./SalesTransaction";
import TreatmentDone from "./TreatmentDone";
import NonSalesDetail from "./NonSalesDetail";
import CustomerHeader from "./CustomerHeader";

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
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

export class DayEndPdf extends React.Component {
  render() {
    let {
      SalesCollectionList,
      landscape,
      reportDate,
      DeptSalesList,
      NonSalesCollectionList,
      ARTransactionList,
      salesTransactionList,
      TreatmentDoneList,
      NonSalesDetailCollectionList,
      accountHeader,
    } = this.props;

    return (
      <Document file="somefile.pdf">
        <Page
          size="A4"
          orientation={landscape ? "landscape" : "portrait"}
          style={styles.page}
        >
          <CustomerHeader accountHeader={accountHeader} />
          <SalesCollectionMainInfo ReportedDate={reportDate} />
          <SalesCollection TableList={SalesCollectionList} />
          <NonSalesCollection TableList={NonSalesCollectionList} />
          <NonSalesDetail
            NonSalesDetailCollectionList={NonSalesDetailCollectionList}
          />
          <DeptSales DeptSalesListFinal={DeptSalesList} />
          <ARTransaction ARTransactionList={ARTransactionList} />
          <SalesTransaction salesTransactionList={salesTransactionList} />
          <TreatmentDone TreatmentDoneList={TreatmentDoneList} />

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      </Document>
    );
  }
}
export default DayEndPdf;
