import React from "react";
import { Text, View, StyleSheet, Link, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    bottom: 10,
  },
  headerImage: {
    flexDirection: "column",
    flexGrow: 3,
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
    fontSize: 12,
    fontWeight: 500,
    alignSelf: "center",
    justifySelf: "flex-center",
    // fontFamily: "Pops",
  },
  subtitle: {
    fontSize: 10,
    justifySelf: "flex-end",
    // fontFamily: "Pops",
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: "auto",
    marginRight: 0,
    justifyContent: "flex-end",
  },
});

export class Header extends React.Component {
  render() {
    let { listDetail } = this.props;
    return (
      <View style={styles.container} fixed>
        {/* <View style={styles.headerImage}>
          <Image style={styles.logo} src={accountHeader.logo} />
        </View> */}
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{listDetail.storeName}</Text>
          <Text style={styles.headerTitle}>{listDetail.addr}</Text>
          
          <Text style={styles.headerTitle}>Stocks Transfer In</Text>
          {/* <Text style={styles.subtitle}>{accountHeader.address}</Text> */}
        </View>
      </View>
    );
  }
}

export default Header;
