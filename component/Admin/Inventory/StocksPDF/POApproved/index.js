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
import { PODetails, POTotal, Supplier } from "./POPDF";
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
    let { itemDetail, listDetail, landscape, blur } = this.props;
    console.log(itemDetail, "itemDetail");
    console.log(listDetail, "listDetail");
    return (
      <Document file="somefile.pdf">
        <Page
          size="A4"
          orientation={landscape ? "landscape" : "portrait"}
          style={styles.page}
        >
          <Header listDetail={listDetail} />

          <Svg height="10" width="500">
            <Polyline points="0,10 500,10" stroke="black" strokeWidth={2} />
          </Svg>

          <PODetails listDetail={listDetail} />

          <Svg height="10" width="500">
            <Polyline points="0,10 500,10" stroke="black" strokeWidth={2} />
          </Svg>

          <Supplier listDetail={listDetail} />

          <Svg height="10" width="500">
            <Polyline points="0,10 500,10" stroke="black" strokeWidth={2} />
          </Svg>

          <View style={styles.tableContainer}>
            <POTableHeader />
            <POTable itemDetail={itemDetail} blur={blur} />
          </View>

          <POTotal listDetail={listDetail} blur={blur} />

          <Svg height="10" width="500">
            <Polyline points="0,10 500,10" stroke="black" strokeWidth={2} />
          </Svg>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftlabel}>NOTE</Text>
            <Text style={styles.label}> : </Text>
            <Text style={styles.leftvalue}>
              {" "}
              1.Specification as per approved sample 2.Please deliver in
              standard packing
            </Text>
          </View>

          <View style={styles.invoiceNoContainer}>
            <Text style={styles.leftrow}>PREPARED BY:</Text>
            <Text style={styles.leftrow}>APPROVED BY:</Text>
          </View>

          <Svg height="50" width="1000">
            <Polyline points="30,50 200,50" stroke="black" strokeWidth={2} />
            <Polyline points="300,50 470,50" stroke="black" strokeWidth={2} />
          </Svg>
        </Page>
      </Document>
    );
  }
}
export default PDF;
