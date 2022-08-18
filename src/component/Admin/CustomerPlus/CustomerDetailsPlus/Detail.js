import React, { Component } from "react";
import "./style.scss";
import {
  Appointments,
  TreatmentHistory,
  PurchaseHistory,
  PersonalDetails,
  Favourites,
  MGMDetails,
  Dianosis,
  ProjectsHistory
} from "./Details";
import classnames from "classnames";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { useParams } from "react-router-dom";
import { withTranslation } from "react-i18next";

export class DetailsClass extends Component {
  state = {
    activeTab: "1",
    isOpenTreatmentDone: false,
    isActiveTab: "detail",
  };

  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const menu = queryParams.get("menu");
    if (menu)
      if (parseInt(menu) >= 1 && parseInt(menu) <= 7)
        this.setState({ activeTab: menu });
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  render() {
    let { t } = this.props;
  console.log(this.props.t("Details"),"I am Tab")

    return (
      <div className="beautesoft-navlink">
        <div className="filled-tabs">
          <div className="tabs-block">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "1",
                  })}
                  onClick={() => {
                    this.toggle("1");
                  }}
                >
                  {t(`Details`)}
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "2",
                  })}
                  onClick={() => {
                    this.toggle("2");
                  }}
                >
                  {t(`Appointments`)}
                </NavLink>
              </NavItem>

              <NavItem className="d-none">
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "3",
                  })}
                  onClick={() => {
                    this.toggle("3");
                  }}
                >
                  {t(`Products`)}
                </NavLink>
              </NavItem>
              <NavItem className="d-none">
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "4",
                  })}
                  onClick={() => {
                    this.toggle("4");
                  }}
                >
                  {t(`Packages`)}
                </NavLink>
              </NavItem>

              <NavItem className="d-none">
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "5",
                  })}
                  onClick={() => {
                    this.toggle("5");
                  }}
                >
                  {t(`Favourites`)}
                </NavLink>
              </NavItem>

              <NavItem className="d-none">
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "6",
                  })}
                  onClick={() => {
                    this.toggle("6");
                  }}
                >
                  {t(`MGM Details`)}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "7",
                  })}
                  onClick={() => {
                    this.toggle("7");
                  }}
                >
                  {t(`Diagnosis`)}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "8",
                  })}
                  onClick={() => {
                    this.toggle("8");
                  }}
                >
                  {t(`Projects`)}
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              {this.state.activeTab === "1" ? (
                <PersonalDetails id={this.props.id} />
              ) : (
                ""
              )}
            </TabPane>

            <TabPane tabId="2">
              {this.state.activeTab === "2" ? (
                <TreatmentHistory id={this.props.id} />
              ) : (
                ""
              )}
            </TabPane>

            <TabPane tabId="3">
              {this.state.activeTab === "3" ? <PurchaseHistory /> : ""}
            </TabPane>
            <TabPane tabId="4">
              {this.state.activeTab === "4" ? <Appointments /> : ""}
            </TabPane>
            <TabPane tabId="5">
              {this.state.activeTab === "5" ? <Favourites /> : ""}
            </TabPane>
            <TabPane tabId="6">
              {this.state.activeTab === "6" ? <MGMDetails /> : ""}
            </TabPane>
            <TabPane tabId="7">
              {this.state.activeTab === "7" ? (
                <Dianosis id={this.props.id} />
              ) : (
                ""
              )}
            </TabPane>
            <TabPane tabId="8">
              {this.state.activeTab === "8" ? (
                <ProjectsHistory id={this.props.id} />
              ) : (
                ""
              )}
            </TabPane>
          </TabContent>
        </div>
      </div>
    );
  }
}

export const Details = withTranslation()(DetailsClass);
