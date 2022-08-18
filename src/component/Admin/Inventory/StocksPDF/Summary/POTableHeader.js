import React from "react";
import { Text, View, StyleSheet,Font } from "@react-pdf/renderer";
// Font.registerHyphenationCallback(word => {
//   const middle = Math.floor(word.length/2);
//   const parts = word.length === 1 ? [word] : [word.substr(0, middle), word.substr(middle)];

//   // Check console to see words parts
//   console.log(word, parts);

//   return parts;
// });;
const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    display:"flex",
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 31,
    textAlign: "center",
    flexGrow: 1,
    fontSize: "10px",

  },
  description: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  date: {
    width: "10%",
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
  day: {
    width: "2%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
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
  },
  inout: {
    width: "3%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
});

export class POTableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container} fixed>
        <Text style={styles.code}>{`Item Code`}</Text>
        <Text style={styles.desc}>{`Item Desc`}</Text>
        <Text style={styles.code}>{`UOM`}</Text>
        <Text style={styles.number}>{`Open`}</Text>
        <Text style={styles.number}>{`Bal`}</Text>
        <Text style={styles.inout}>In/Out</Text>
        <Text style={styles.number}>{`Tot`}</Text>
        <Text style={styles.day}>1</Text>
        <Text style={styles.day}>2</Text>
        <Text style={styles.day}>3</Text>
        <Text style={styles.day}>4</Text>
        <Text style={styles.day}>5</Text>
        <Text style={styles.day}>6</Text>
        <Text style={styles.day}>7</Text>
        <Text style={styles.day}>8</Text>
        <Text style={styles.day}>9</Text>
        <Text style={styles.day}>10</Text>
        <Text style={styles.day}>11</Text>
        <Text style={styles.day}>12</Text>
        <Text style={styles.day}>13</Text>
        <Text style={styles.day}>14</Text>
        <Text style={styles.day}>15</Text>
        <Text style={styles.day}>16</Text>
        <Text style={styles.day}>17</Text>
        <Text style={styles.day}>18</Text>
        <Text style={styles.day}>19</Text>
        <Text style={styles.day}>20</Text>
        <Text style={styles.day}>21</Text>
        <Text style={styles.day}>22</Text>
        <Text style={styles.day}>23</Text>
        <Text style={styles.day}>24</Text>
        <Text style={styles.day}>25</Text>
        <Text style={styles.day}>26</Text>
        <Text style={styles.day}>27</Text>
        <Text style={styles.day}>28</Text>
        <Text style={styles.day}>29</Text>
        <Text style={styles.day}>30</Text>
        <Text style={styles.day}>31</Text>

      </View>
    );
  }
}
