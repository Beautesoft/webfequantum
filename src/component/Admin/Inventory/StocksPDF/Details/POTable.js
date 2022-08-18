import React, { Fragment } from "react";
import { Text, View, StyleSheet,Font} from "@react-pdf/renderer";
const borderColor = "#90e5fc";
// Font.registerHyphenationCallback(ss => {
//   const middle = Math.floor(ss.length/2);
//   const parts = ss.length === 1 ? [ss] : [ss.substr(0, middle), ss.substr(middle)];

//   // Check console to see words parts
//   console.log(ss, parts);

//   return parts;
// });
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    flexGrow: 1,
    fontSize: "9px",
    alignItems: "center",
    height:50,
  },
  description: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  date: { 
    width: "10%", 
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  total: {
    width: "72%",
    borderRightColor: borderColor,
    borderRightWidth: 1, 
    textAlign: "center", 
  },
  status: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  number: {
    width: "5%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  code: {
    width: "8%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  desc: {
    width: "16%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
});

export class POTable extends React.Component {
  render() {
    let { reportDetailsList, blur  } = this.props;
    let ss= reportDetailsList;
    return reportDetailsList.map((list, index) => (
      list.map((item, index)=>(
        !isNaN(item.total) ? 
        <View wrap={false} style={styles.row} key={index}>
        <Text style={styles.total}></Text>
        <Text style={styles.code}>Total</Text>
        <Text style={styles.number}>{item.total}</Text>
      
      </View>
      :
        <View wrap={false} style={styles.row} key={index}>
        <Text style={styles.code}>{item.ITEMCODE}</Text>
        <Text style={styles.desc}>{item.ITEMDESC}</Text>
        <Text style={styles.code}>{item.Item_UOM}</Text>
        <Text style={styles.code}>{item.TRN_POST}</Text>
        <Text style={styles.code}>{item.TRN_DATE}</Text>
        <Text style={styles.code}>{item.TRN_TYPE}</Text>
        <Text style={styles.code}>{item.TRN_DOCNO}</Text>
        <Text style={styles.code}>{item.FSTORE_NO}</Text>
        <Text style={styles.code}>{item.TSTORE_NO}</Text>
        <Text style={styles.number}>{item.TRN_QTY}</Text>
        <Text style={styles.number}>{item.TRN_AMT}</Text>
        <Text style={styles.code}>{item.TRN_BALQTY}</Text>
      
      </View>
        ))

      
    ));
  }
}
