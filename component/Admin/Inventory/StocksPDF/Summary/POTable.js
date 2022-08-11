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
    height:30,
  },
  description: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  desc: { 
    width: "14%", 
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  total: {
    width: "32%",
    borderRightColor: borderColor,
    borderRightWidth: 1, 
    textAlign: "center", 
  },
  day: {
    width: "2%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  number: {
    width: "3%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  code: {
    width: "6%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  inout: {
    width: "3%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
});

export class POTable extends React.Component {

  // In = (item) => {
  //   return (<View  wrap={false} style={styles.row} key={index}>
  //     <Text style={styles.code}>{item[item.length-1].itemcode}</Text>
  //     <Text style={styles.code}>{item[item.length-1].itemuom}</Text>
  //     <Text style={styles.number}>{item[item.length-1].openqty}</Text>
  //     <Text style={styles.number}>{item[item.length-1].balqty}</Text>
  //     <Text style={styles.inout}>In</Text>
  //     <Text style={styles.number}>{item[item.length-1].inqty}</Text>
  //     <Text style={styles.day}>{item[0].dayin}</Text>
  //     <Text style={styles.day}>{item[1].dayin}</Text>
  //     <Text style={styles.day}>{item[2].dayin}</Text>
  //     <Text style={styles.day}>{item[3].dayin}</Text>
  //     <Text style={styles.day}>{item[4].dayin}</Text>
  //     <Text style={styles.day}>{item[5].dayin}</Text>
  //     <Text style={styles.day}>{item[6].dayin}</Text>
  //     <Text style={styles.day}>{item[7].dayin}</Text>
  //     <Text style={styles.day}>{item[8].dayin}</Text>
  //     <Text style={styles.day}>{item[9].dayin}</Text>
  //     <Text style={styles.day}>{item[10].dayin}</Text>
  //     <Text style={styles.day}>{item[11].dayin}</Text>
  //     <Text style={styles.day}>{item[12].dayin}</Text>
  //     <Text style={styles.day}>{item[13].dayin}</Text>
  //     <Text style={styles.day}>{item[14].dayin}</Text>
  //     <Text style={styles.day}>{item[15].dayin}</Text>
  //     <Text style={styles.day}>{item[16].dayin}</Text>
  //     <Text style={styles.day}>{item[17].dayin}</Text>
  //     <Text style={styles.day}>{item[18].dayin}</Text>
  //     <Text style={styles.day}>{item[19].dayin}</Text>
  //     <Text style={styles.day}>{item[20].dayin}</Text>
  //     <Text style={styles.day}>{item[21].dayin}</Text>
  //     <Text style={styles.day}>{item[22].dayin}</Text>
  //     <Text style={styles.day}>{item[23].dayin}</Text>
  //     <Text style={styles.day}>{item[24].dayin}</Text>
  //     <Text style={styles.day}>{item[25].dayin}</Text>
  //     <Text style={styles.day}>{item[26].dayin}</Text>
  //     <Text style={styles.day}>{item[27].dayin}</Text>
  //     <Text style={styles.day}>{item[28].dayin}</Text>
  //     <Text style={styles.day}>{item[29].dayin}</Text>
  //     <Text style={styles.day}>{item[30].dayin}</Text>

      
    
  //   </View>)
  // }
  // Out = (item) => {
  //   return (<View  wrap={false} style={styles.row} key={index}>
  //     <Text style={styles.total}>OUT</Text>
  //     <Text style={styles.inout}>OUT</Text>
  //     <Text style={styles.number}>{item[item.length-1].outqty}</Text>
  //     <Text style={styles.day}>{item[0].dayout}</Text>
  //     <Text style={styles.day}>{item[1].dayout}</Text>
  //     <Text style={styles.day}>{item[2].dayout}</Text>
  //     <Text style={styles.day}>{item[3].dayout}</Text>
  //     <Text style={styles.day}>{item[4].dayout}</Text>
  //     <Text style={styles.day}>{item[5].dayout}</Text>
  //     <Text style={styles.day}>{item[6].dayout}</Text>
  //     <Text style={styles.day}>{item[7].dayout}</Text>
  //     <Text style={styles.day}>{item[8].dayout}</Text>
  //     <Text style={styles.day}>{item[9].dayout}</Text>
  //     <Text style={styles.day}>{item[10].dayout}</Text>
  //     <Text style={styles.day}>{item[11].dayout}</Text>
  //     <Text style={styles.day}>{item[12].dayout}</Text>
  //     <Text style={styles.day}>{item[13].dayout}</Text>
  //     <Text style={styles.day}>{item[14].dayout}</Text>
  //     <Text style={styles.day}>{item[15].dayout}</Text>
  //     <Text style={styles.day}>{item[16].dayout}</Text>
  //     <Text style={styles.day}>{item[17].dayout}</Text>
  //     <Text style={styles.day}>{item[18].dayout}</Text>
  //     <Text style={styles.day}>{item[19].dayout}</Text>
  //     <Text style={styles.day}>{item[20].dayout}</Text>
  //     <Text style={styles.day}>{item[21].dayout}</Text>
  //     <Text style={styles.day}>{item[22].dayout}</Text>
  //     <Text style={styles.day}>{item[23].dayout}</Text>
  //     <Text style={styles.day}>{item[24].dayout}</Text>
  //     <Text style={styles.day}>{item[25].dayout}</Text>
  //     <Text style={styles.day}>{item[26].dayout}</Text>
  //     <Text style={styles.day}>{item[27].dayout}</Text>
  //     <Text style={styles.day}>{item[28].dayout}</Text>
  //     <Text style={styles.day}>{item[29].dayout}</Text>
  //     <Text style={styles.day}>{item[30].dayout}</Text>

      
    
  //   </View>)
  // }
  render() {
    let { reportSummaryList, blur  } = this.props;
    // let ss= reportSummaryList;
    const summaryList = [1,2]
    return reportSummaryList.map((item, index) => (
      summaryList.map((x, index)=>(
        x == 1 ?
        <View  wrap={false} style={styles.row} key={index}>   
        <Text style={styles.code}>{item[item.length-1].itemcode}</Text>
        <Text style={styles.desc}>{item[item.length-1].itemdesc}</Text>
        <Text style={styles.code}>{item[item.length-1].itemuom}</Text>
        <Text style={styles.number}>{item[item.length-1].openqty}</Text>
        <Text style={styles.number}>{item[item.length-1].balqty}</Text>
        <Text style={styles.inout}>In</Text>
        <Text style={styles.number}>{item[item.length-1].inqty}</Text>
        <Text style={styles.day}>{item[0].dayin}</Text>
        <Text style={styles.day}>{item[1].dayin}</Text>
        <Text style={styles.day}>{item[2].dayin}</Text>
        <Text style={styles.day}>{item[3].dayin}</Text>
        <Text style={styles.day}>{item[4].dayin}</Text>
        <Text style={styles.day}>{item[5].dayin}</Text>
        <Text style={styles.day}>{item[6].dayin}</Text>
        <Text style={styles.day}>{item[7].dayin}</Text>
        <Text style={styles.day}>{item[8].dayin}</Text>
        <Text style={styles.day}>{item[9].dayin}</Text>
        <Text style={styles.day}>{item[10].dayin}</Text>
        <Text style={styles.day}>{item[11].dayin}</Text>
        <Text style={styles.day}>{item[12].dayin}</Text>
        <Text style={styles.day}>{item[13].dayin}</Text>
        <Text style={styles.day}>{item[14].dayin}</Text>
        <Text style={styles.day}>{item[15].dayin}</Text>
        <Text style={styles.day}>{item[16].dayin}</Text>
        <Text style={styles.day}>{item[17].dayin}</Text>
        <Text style={styles.day}>{item[18].dayin}</Text>
        <Text style={styles.day}>{item[19].dayin}</Text>
        <Text style={styles.day}>{item[20].dayin}</Text>
        <Text style={styles.day}>{item[21].dayin}</Text>
        <Text style={styles.day}>{item[22].dayin}</Text>
        <Text style={styles.day}>{item[23].dayin}</Text>
        <Text style={styles.day}>{item[24].dayin}</Text>
        <Text style={styles.day}>{item[25].dayin}</Text>
        <Text style={styles.day}>{item[26].dayin}</Text>
        <Text style={styles.day}>{item[27].dayin}</Text>
        <Text style={styles.day}>{item[28].dayin}</Text>
        <Text style={styles.day}>{item[29].dayin}</Text>
        <Text style={styles.day}>{item[30].dayin}</Text>
        </View>
        :
        <View  wrap={false} style={styles.row} key={index}>
        <Text style={styles.total}></Text>
        <Text style={styles.inout}>OUT</Text>
        <Text style={styles.number}>{item[item.length-1].outqty}</Text>
        <Text style={styles.day}>{item[0].dayout}</Text>
        <Text style={styles.day}>{item[1].dayout}</Text>
        <Text style={styles.day}>{item[2].dayout}</Text>
        <Text style={styles.day}>{item[3].dayout}</Text>
        <Text style={styles.day}>{item[4].dayout}</Text>
        <Text style={styles.day}>{item[5].dayout}</Text>
        <Text style={styles.day}>{item[6].dayout}</Text>
        <Text style={styles.day}>{item[7].dayout}</Text>
        <Text style={styles.day}>{item[8].dayout}</Text>
        <Text style={styles.day}>{item[9].dayout}</Text>
        <Text style={styles.day}>{item[10].dayout}</Text>
        <Text style={styles.day}>{item[11].dayout}</Text>
        <Text style={styles.day}>{item[12].dayout}</Text>
        <Text style={styles.day}>{item[13].dayout}</Text>
        <Text style={styles.day}>{item[14].dayout}</Text>
        <Text style={styles.day}>{item[15].dayout}</Text>
        <Text style={styles.day}>{item[16].dayout}</Text>
        <Text style={styles.day}>{item[17].dayout}</Text>
        <Text style={styles.day}>{item[18].dayout}</Text>
        <Text style={styles.day}>{item[19].dayout}</Text>
        <Text style={styles.day}>{item[20].dayout}</Text>
        <Text style={styles.day}>{item[21].dayout}</Text>
        <Text style={styles.day}>{item[22].dayout}</Text>
        <Text style={styles.day}>{item[23].dayout}</Text>
        <Text style={styles.day}>{item[24].dayout}</Text>
        <Text style={styles.day}>{item[25].dayout}</Text>
        <Text style={styles.day}>{item[26].dayout}</Text>
        <Text style={styles.day}>{item[27].dayout}</Text>
        <Text style={styles.day}>{item[28].dayout}</Text>
        <Text style={styles.day}>{item[29].dayout}</Text>
        <Text style={styles.day}>{item[30].dayout}</Text>
      </View>
      ))
      // <Text style={styles.total}>OUT</Text>
      // <Text style={styles.inout}>OUT</Text>
      // <Text style={styles.number}>{item[item.length-1].outqty}</Text>
      // <Text style={styles.day}>{item[0].dayout}</Text>
      // <Text style={styles.day}>{item[1].dayout}</Text>
      // <Text style={styles.day}>{item[2].dayout}</Text>
      // <Text style={styles.day}>{item[3].dayout}</Text>
      // <Text style={styles.day}>{item[4].dayout}</Text>
      // <Text style={styles.day}>{item[5].dayout}</Text>
      // <Text style={styles.day}>{item[6].dayout}</Text>
      // <Text style={styles.day}>{item[7].dayout}</Text>
      // <Text style={styles.day}>{item[8].dayout}</Text>
      // <Text style={styles.day}>{item[9].dayout}</Text>
      // <Text style={styles.day}>{item[10].dayout}</Text>
      // <Text style={styles.day}>{item[11].dayout}</Text>
      // <Text style={styles.day}>{item[12].dayout}</Text>
      // <Text style={styles.day}>{item[13].dayout}</Text>
      // <Text style={styles.day}>{item[14].dayout}</Text>
      // <Text style={styles.day}>{item[15].dayout}</Text>
      // <Text style={styles.day}>{item[16].dayout}</Text>
      // <Text style={styles.day}>{item[17].dayout}</Text>
      // <Text style={styles.day}>{item[18].dayout}</Text>
      // <Text style={styles.day}>{item[19].dayout}</Text>
      // <Text style={styles.day}>{item[20].dayout}</Text>
      // <Text style={styles.day}>{item[21].dayout}</Text>
      // <Text style={styles.day}>{item[22].dayout}</Text>
      // <Text style={styles.day}>{item[23].dayout}</Text>
      // <Text style={styles.day}>{item[24].dayout}</Text>
      // <Text style={styles.day}>{item[25].dayout}</Text>
      // <Text style={styles.day}>{item[26].dayout}</Text>
      // <Text style={styles.day}>{item[27].dayout}</Text>
      // <Text style={styles.day}>{item[28].dayout}</Text>
      // <Text style={styles.day}>{item[29].dayout}</Text>
      // <Text style={styles.day}>{item[30].dayout}</Text>
    ));
  }
}
