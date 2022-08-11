import React from "react";
import { Text, View, StyleSheet, Link, Image } from "@react-pdf/renderer";
import default_logo from "assets/images/headerLogo.png";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    bottom: 10,
  },
  headerImage: {
    flexDirection: "column",
    flexGrow: 2,
    textTransform: "uppercase",
    alignSelf: "flex-right",
  },
  headerText: {
    flexDirection: "column",
    flexGrow: 2,
    alignSelf: "flex-center",
    justifySelf: "flex-center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 500,
    // fontFamily: "Pops",
  },
  subtitle: {
    fontSize: 10,
    justifySelf: "flex-end",
    // fontFamily: "Pops",
  },
  logo: {
    width: 60,
    height: 60,
    padding: 1,
    marginLeft: "auto",
    marginRight: 0,
    justifyContent: "flex-end",
    objectFit: "contain",
  },
});

export class CustomerHeader extends React.Component {
  render() {
    let { accountHeader } = this.props;
    return (
      <View style={styles.container} fixed>
        <View style={styles.headerImage}>
          <Image
            style={styles.logo}
            src={accountHeader.logo ? accountHeader.logo : default_logo}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            {accountHeader.name ? accountHeader.name : "Beautesoft"}
          </Text>
          <Text style={styles.subtitle}>
            {accountHeader.address ? accountHeader.address : "Address-line"}
          </Text>
        </View>
      </View>
    );
  }
}

export default CustomerHeader;
