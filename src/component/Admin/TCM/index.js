import React, { Component } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { TCMCustomerList } from "./TCMCustomerList";
import { TCMPaymentList } from "./TCMPaymentList";

import { withTranslation } from "react-i18next";

export class TCMClass extends Component {
  state = {
    activeMenu: "customerList",
  };
  toggle = tab => {
    if (this.state.activeMenu !== tab) {
      this.setState({
        activeMenu: tab,
      });
    }
  };
  render() {
    let { activeMenu } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="smtp-Setting-section col-12">
          <div className="row">
            <div className="beautesoft-navlink customer-detail mt-3">
              <div className="filled-tabs">
                <div className="tabs-block">
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeMenu === "customerList",
                        })}
                        onClick={() =>
                          this.setState({
                            activeMenu: "customerList",
                          })
                        }
                      >
                        {t("Customer List")}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeMenu === "paymentList",
                        })}
                        onClick={() =>
                          this.setState({
                            activeMenu: "paymentList",
                          })
                        }
                      >
                        {t("Payment")} &amp; {t("Prescribe")}
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </div>
            </div>
          </div>
          <TabContent activeTab={this.state.activeMenu}>
            <TabPane tabId="customerList">
              {activeMenu === "customerList" ? (
                <div className="smtp-Setting-section">
                  <div className="">
                    <TCMCustomerList />
                  </div>
                </div>
              ) : null}
            </TabPane>
          </TabContent>
          <TabContent activeTab={this.state.activeMenu}>
            <TabPane tabId="paymentList">
              {activeMenu === "paymentList" ? (
                <div className="smtp-Setting-section">
                  <div className="">
                    <TCMPaymentList />
                  </div>
                </div>
              ) : null}
            </TabPane>
          </TabContent>
        </div>
      </>
    );
  }
}

export const TCM = withTranslation()(TCMClass);
