import React from "react";
import { Navigation } from "react-minimal-side-navigation";
import { RedeemPolicyTable } from "./RedeemPolicyTable";
import { RewardPolicyTable } from "./RewardPolicyTable";
import { withTranslation } from "react-i18next";

class LoyaltyPointsManagementSettingsClass extends React.Component {
  state = {
    currentMenu: "/",
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handleMenuChange = itemId => {
    this.updateState({
      currentMenu: itemId,
    });
  };

  render() {
    let { currentMenu } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="customer-list container-fluid">
          <h3 className="head-label mb-5">{t("Loyalty Program")}</h3>
          <div className="row">
            <div className="col-md-2 mb-5">
              <Navigation
                activeItemId="/"
                onSelect={({ itemId }) => this.handleMenuChange(itemId)}
                items={[
                  {
                    title: "Reward Policy",
                    itemId: "/",
                  },
                  {
                    title: "Redeem Policy",
                    itemId: "/redeem",
                  },
                ]}
              />
            </div>
            <div className="col-md-10">
              {currentMenu == "/" ? (
                <RewardPolicyTable history={this.props.history} />
              ) : (
                <RedeemPolicyTable history={this.props.history} />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
export const LoyaltyPointsManagementSettings = withTranslation()(
  LoyaltyPointsManagementSettingsClass
);
