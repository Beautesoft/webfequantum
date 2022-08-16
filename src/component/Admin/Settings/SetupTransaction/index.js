import React, { Component } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";

import { SetupTransList } from "./SetupTransList";
import { SmtpList } from "../SmtpSettings/SmtpList";

export class SetupTransaction extends Component {
  state = {
    activeMenu: "setupTransaction",
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
                          active: this.state.activeMenu === "smtpSettings",
                        })}
                        onClick={() =>
                          this.props.history.push(
                            `/admin/settings/smtpsettings`
                          )
                        }
                      >
                        SMTP Settings
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeMenu === "setupTransaction",
                        })}
                        onClick={() =>
                          this.props.history.push(
                            `/admin/settings/setuptransaction`
                          )
                        }
                      >
                        Setup Transaction
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </div>
            </div>
          </div>
          <TabContent activeTab={this.state.activeMenu}>
            <TabPane tabId="setupTransaction">
              {activeMenu === "setupTransaction" ? (
                <div className="setupTrans-section">
                  <div className="">
                    <SetupTransList />
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
