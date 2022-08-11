import React, { Component } from "react";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCustomerPlusSettings,
  updateCustomerPlusSettings,
} from "redux/actions/customerPlus";
import {
  NormalInput,
  NormalDateTime,
  NormalSelect,
  NormalMultiSelect,
  NormalButton,
  LayoutEditor,
} from "component/common";
import { withTranslation } from "react-i18next";

export class EditLayoutClass extends Component {
  state = {
    formFields: {},
    fields: [
      {
        id: 1,
        field_name: "cust_dob",
        display_field_name: "Customer DOB",
        visible_in_registration: true,
        visible_in_listing: true,
        visible_in_profile: true,
        mandatory: true,
        data_type: "Dat",
        selection: null,
      },
    ],
    layout: { lg: [], sm: [], md: [] },
    isLoading: true,
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({ isLoading: true });
    await this.props.getCustomerPlusSettings("details");
    this.state.fields = this.props.customerPlusSettings.filter(
      e => e.visible_in_registration
    );
    this.state.formFields = this.state.fields.reduce((map, obj) => {
      map[obj.field_name] = "";
      return map;
    }, {});
    this.setState({ isLoading: false });
  };

  handleSubmit = async () => {
    this.setState({ isLoading: true });
    let { layout, fields } = this.state;
    layout.lg.forEach(e => {
      let { w, h, x, y } = e;
      fields.find(e2 => e2.id == e.i).layout.lg = { w, h, x, y };
    });
    layout.md.forEach(e => {
      let { w, h, x, y } = e;
      fields.find(e2 => e2.id == e.i).layout.md = { w, h, x, y };
    });
    layout.sm.forEach(e => {
      let { w, h, x, y } = e;
      fields.find(e2 => e2.id == e.i).layout.sm = { w, h, x, y };
    });
    try {
      await this.props.updateCustomerPlusSettings({
        customerControlList: fields,
      });
    } catch (e) {
      console.log(e);
    }
    this.loadData();
  };

  renderLayout = () => {
    let { t } = this.props;
    let filtered = this.state.fields;
    const renderFormData = (e, index) => {
      return (
        <div key={index}>
          <div className="input-group">
            {e.data_type == "text" ? (
              <NormalInput
                placeholder={e.field_name}
                name={e.field_name}
                disabled={true}
              />
            ) : e.data_type == "date" ? (
              <NormalDateTime disabled={true} />
            ) : e.data_type == "datetime" ? (
              <NormalDateTime disabled={true} />
            ) : e.data_type == "selection" ? (
              <NormalSelect
                placeholder={e.field_name}
                name={e.field_name}
                disabled={true}
              />
            ) : e.data_type == "multiSelect" ? (
              <NormalMultiSelect
                placeholder={e.field_name}
                name={e.field_name}
                disabled={true}
              />
            ) : e.data_type == "boolean" ? (
              <input type="checkbox" name={e.field_name} />
            ) : e.data_type == "number" ? (
              <NormalInput
                type="number"
                placeholder={e.field_name}
                name={e.field_name}
                disabled={true}
              />
            ) : (
              t("NO FILED RENDER DATA FOUND")
            )}
          </div>
        </div>
      );
    };
    return filtered.map(e => {
      return (
        <div key={`${e.id}`}>
          {e.showLabel && (
            <label className="text-left text-black common-label-text fs-17">
              {t(e.display_field_name)}
            </label>
          )}
          {renderFormData(e)}
        </div>
      );
    });
  };

  render() {
    let { isLoading } = this.state;
    let { t } = this.props;
    return (
      <div className="create-customer-section container-fluid">
        {/* <p className="list-heading pb-4"> {id ? "Edit" : "Add"} Customer</p> */}
        <div className="create-customerplus">
          <div className="col-md-12 mb-4">
            <h3 className="head-label">{t("Edit Form Layout")}</h3>
          </div>
          <div className="customer-detail">
            {isLoading ? (
              <div class="d-flex mt-5 align-items-center justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="row d-flex justify-content-end">
                  <div className="col-md-4 col-sm-12 mb-4">
                    <NormalButton
                      onClick={() => this.handleSubmit()}
                      label="SAVE"
                      mainbg={true}
                      className="mr-2 col-12"
                    />
                  </div>
                </div>
                <div className="form-group mb-4 pb-2 row border">
                  <LayoutEditor
                    fields={this.state.fields}
                    onChange={layout => this.updateState({ layout })}
                    editable={true}
                  >
                    {this.renderLayout()}
                  </LayoutEditor>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customerPlusSettings: state.customerPlus.customerPlusSettings,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCustomerPlusSettings,
      updateCustomerPlusSettings,
    },
    dispatch
  );
};

export const CustomerPlusEditLayout = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(EditLayoutClass)
);
