import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 10,
    margin: 10,
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: "grey",
  },
  title: {
    fontSize: 15,
    textAlign: "center",
  },
  author: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 3,
  },
});

export class ReceiptHeader extends React.Component {
  render() {
    let { accountHeader, headerInfoDetail } = this.props;

    return (
      <View style={styles.borderStyle}>
        <View style={styles.container}>
          <Text style={styles.subtitle}>{`良医中医-PLQ`}</Text>
          <Text style={styles.title}>{accountHeader.siteHeader}</Text>
          <Text style={styles.author}>
            Reg. No: {accountHeader.companyRegNo}
          </Text>
          <Text style={styles.subtitle}>{accountHeader.siteAddress}</Text>
        </View>
      </View>
    );
  }
}

export default ReceiptHeader;
