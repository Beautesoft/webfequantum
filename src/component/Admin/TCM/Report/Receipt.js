import React from "react";
import {
  Page,
  Document,
  Image,
  StyleSheet,
  Text,
  Font,
} from "@react-pdf/renderer";
import { ReceiptBalance, ReceiptHeader } from "./Receipt/index";

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

export class Receipt extends React.Component {
  render() {
    let { accountHeader, landscape, MainInfo } = this.props;
    console.log(MainInfo, "responapipresc");
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
                  <ReceiptHeader
                    accountHeader={accountHeader}
                    headerInfoDetail={data}
                  />
                  <ReceiptBalance headerInfoDetail={data} />
                </Page>
              );
            })
          : null}
      </Document>
    );
  }
}
export default Receipt;
