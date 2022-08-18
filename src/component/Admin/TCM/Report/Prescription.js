import React from "react";
import {
  Page,
  Document,
  Image,
  StyleSheet,
  Text,
  Font,
} from "@react-pdf/renderer";
import InvoiceItemsTable from "./InvoiceItemsTable";
import logo from "assets/images/logo.png";
import PrescriptionHeader from "./PrescriptionHeader";
import PrescriptionFooter from "./PrescriptionFooter";

import { PrescriptionMainInfo } from "./MainTableReport";

import allfont from "../../../../assets/fonts/ZCOOL_XiaoWei/ZCOOLXiaoWei-Regular.ttf";

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
    bottom: 20,
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
});

export class Prescription extends React.Component {
  render() {
    let { accountHeader, landscape, TableDetail, MainInfo } = this.props;
    console.log(MainInfo, "responmaininfoapipresc");
    console.log(TableDetail, "respontableapipresc");
    return (
      <Document file="somefile.pdf">
        {MainInfo.length > 0
          ? MainInfo.map((data, index) => {
              return (
                <Page
                  size="A4"
                  orientation={landscape ? "landscape" : "portrait"}
                  style={styles.page}
                  key={index}
                >
                  <PrescriptionHeader accountHeader={data} />

                  <PrescriptionMainInfo
                    accountHeader={data}
                    SumQty={TableDetail[0].Items.filter(
                      acc => acc.itemGroup === data.itemGroup
                    ).reduce(function (prev, current) {
                      return prev + +current.itemQty;
                    }, 0)}
                    SumTotal={TableDetail[0].Items.filter(
                      acc => acc.itemGroup === data.itemGroup
                    ).reduce(function (prev, current) {
                      return prev + +current.itemQty * data.daysToTakeMedicine;
                    }, 0)}
                  />
                  {TableDetail[0].Items.length > 0 ? (
                    <InvoiceItemsTable
                      TableList={
                        TableDetail[0].Items.length > 0
                          ? TableDetail[0].Items.filter(
                              acc => acc.itemGroup === data.itemGroup
                            )
                          : []
                      }
                      MainInfo={data}
                    />
                  ) : (
                    ""
                  )}
                  <PrescriptionFooter />
                </Page>
              );
            })
          : null}
      </Document>
    );
  }
}
export default Prescription;
