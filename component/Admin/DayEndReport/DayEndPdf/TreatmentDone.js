import React from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import {
  TreatmentDoneBlankSpace,
  TreatmentDoneInfo,
  TreatmentDoneTableHeader,
  TreatmentDoneTableRow,
} from "./TreatmentDoneTable";

const tableRowsCount = 11;
const backColor = "#3c4087";
const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: backColor,
    fontSize: "10px",
  },
  row: {
    flexDirection: "row",
    borderBottomColor: backColor,
    borderBottomWidth: 1,
    alignItems: "center",
    fontSize: "10px",
  },

  description: {
    width: "100%",
    textAlign: "center",
  },
});

export class TreatmentDone extends React.Component {
  render() {
    let { TreatmentDoneList } = this.props;

    return (
      <View style={styles.tableContainer}>
        <TreatmentDoneInfo />
        <TreatmentDoneTableHeader />
        {TreatmentDoneList.treatment_done &&
        TreatmentDoneList.treatment_done.length > 0 ? (
          <TreatmentDoneTableRow items={TreatmentDoneList.treatment_done} />
        ) : (
          <View style={styles.row}>
            <Text style={styles.description}>No data</Text>
          </View>
        )}
        <TreatmentDoneBlankSpace TableList={TreatmentDoneList} />
      </View>
    );
  }
}

export default TreatmentDone;
