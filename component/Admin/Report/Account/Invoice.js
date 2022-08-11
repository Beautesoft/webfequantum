import React, { Fragment } from "react";
import {
  Page,
  Document,
  Image,
  StyleSheet,
  Text,
  Font,
  View,
} from "@react-pdf/renderer";
import InvoiceItemsTable from "./InvoiceItemsTable";
import logo from "assets/images/logo.png";
import CustomerHeader from "./CustomerHeader";
import CustomerFooter from "./CustomerFooter";

import {
  AccountMainInfo,
  AccountDetailInfo,
  ProductMainInfo,
  ProductDetailMain,
} from "./TreatmentAccount";
import { PrepaidInfo } from "./TreatmentAccount";

import {
  ManualInvoiceMainInfo,
  ManualInvoiceSecondaryInfo,
} from "./Quantum/ManualInvoice";
import { PrepaidDetailInfo } from "./TreatmentAccount/DetailPrepaid";

import allfont from "../../../../assets/fonts/ZCOOL_XiaoWei/ZCOOLXiaoWei-Regular.ttf";
import { CreditMainInfo } from "./TreatmentAccount/CreditReport";

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
  footerContainer: {
    flexDirection: "row",
    paddingTop: "30px",
    alignItems: "left",
    minHeight: 30,
    textAlign: "left",
    fontSize: "10px",
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  imgcont:{
    width:150,
    height:100
  }
});

export class Invoice extends React.Component {
  render() {
    let { accountHeader, TableList, Flag, landscape ,termsandcondition } = this.props;
    console.log(accountHeader, "propsaccountheadervaluesresult");
    return (
      <Document file="somefile.pdf">
        <Page
          size="A4"
          orientation={landscape ? "landscape" : "portrait"}
          style={styles.page}
        >
          <CustomerHeader accountHeader={accountHeader} />
          {Flag == 1 ? (
            <AccountMainInfo accountHeader={accountHeader} />
          ) : Flag == 2 ? (
            <CreditMainInfo accountHeader={accountHeader} />
          ) : Flag == 3 ? (
            <PrepaidInfo accountHeader={accountHeader} />
          ) : Flag == 5 ? (
            <ProductMainInfo accountHeader={accountHeader} />
          ) : Flag == 6 ? (
            <ProductDetailMain accountHeader={accountHeader} />
          ) : Flag == 4 ? (
            <PrepaidDetailInfo accountHeader={accountHeader} />
          ) : Flag == 7 ? (
            <ManualInvoiceMainInfo
              accountHeader={TableList.manualinvoice}
              Flag={Flag}
            />
          ) : Flag == 8 ? (
            <ManualInvoiceMainInfo
              accountHeader={TableList.workordinvoice}
              Flag={Flag}
            />
          ): Flag == 9 ?(
            <ManualInvoiceMainInfo
              accountHeader={TableList.deliveryorder}
              Flag={Flag}
            />
          ): Flag ==10 ?(
            <ManualInvoiceMainInfo
              accountHeader={TableList.quotation}
              Flag={Flag}
            />
          ): (
            <AccountDetailInfo accountHeader={accountHeader} />
          )}

          <InvoiceItemsTable TableList={TableList} Flag={Flag} />

          {Flag == 7 && (
            <Fragment>
              <ManualInvoiceSecondaryInfo
                accountHeader={TableList.manualinvdtl}
              ></ManualInvoiceSecondaryInfo>
              <View style={styles.footerContainer}>
                <Text>{TableList.manualinvoice["footer"]}</Text>
              </View>
            </Fragment>
          )}

          {Flag == 8 && (
            <Fragment>
              <ManualInvoiceSecondaryInfo
                accountHeader={TableList.workordinvdtl}
              ></ManualInvoiceSecondaryInfo>
              <View style={styles.footerContainer}>
                <Text>{TableList.workordinvoice["footer"]}</Text>
              </View>
            </Fragment>
          )}
          {Flag == 9 && (
            <Fragment>
              <ManualInvoiceSecondaryInfo
                accountHeader={TableList.deliverydtl}
              ></ManualInvoiceSecondaryInfo>
              <View style={styles.footerContainer}>
                <Text>{TableList.deliveryorder["footer"]}</Text>
              </View>
            </Fragment>
          )}
          {Flag == 10 && (
            <Fragment>
              <ManualInvoiceSecondaryInfo
                accountHeader={TableList.quotationdtl}
              ></ManualInvoiceSecondaryInfo>
              <View style={styles.footerContainer}>
                <Text>{TableList.quotationdtl["footer"]}</Text>
              </View>
            </Fragment>
          )}
          {Flag == 9 && (
            <Fragment>            
              <View style={styles.imgcont}>
              <Image src={this.props.signPhoto} />
              </View>
            </Fragment>
          )}
          {Flag == 10 && (
            <Fragment>
             <View >
               Terms And Condition
              <p className="">
              {termsandcondition}
              </p>
              </View>
             
            </Fragment>
          )}
          
          

          <CustomerFooter />
        </Page>
      </Document>
    );
  }
}
export default Invoice;
