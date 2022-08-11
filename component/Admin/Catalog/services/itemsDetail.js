import React, { Component } from "react";
import {
  NormalButton,
  NormalSelect,
  NormalModal,
  NormalInput,
} from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import Brush from "assets/images/make-up-brush.png";
import filter from "assets/images/filter.png";
import CartImg from "assets/images/shopping-cart.png";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonCreateApi,
  updateForm,
} from "redux/actions/common";
import closeIcon from "assets/images/close.png";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { history } from "helpers";
import { withTranslation } from "react-i18next";

export class ItemDetailClass extends Component {
  state = {
    servicesDetail: {},
    isOpenModal: false,
    branchList: [],
    customerDetail: {
      branchId: "",
      cust_noid: "",
    },
    customerList: [],
  };

  componentDidMount = () => {
    console.log(this.props, "jhksdfkjsdhfks");
    this.getDetail();
    let { productCard, branchList } = this.state;

    this.props.getCommonApi(`treatment/Outlet/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          branchList.push({ value: value.id, label: value.itemsite_desc });
        }
        this.setState({ branchList });
        // console.log(brachList, "jhksdfkjsdhfks")
      }
    });
  };

  getDetail = () => {
    let { productCard, branchList } = this.state;
    let { menuId, id, api } = this.props;
    this.props.getCommonApi(`${api}/${id}/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        this.setState({ servicesDetail: data });
      }
    });
  };

  handleChange = async ({ target: { value, name } }) => {
    let { customerDetail, customerList } = this.state;
    console.log("uihwkjrwkej", name, value);
    customerDetail[name] = value;
    await this.setState({
      customerDetail,
    });
    if (name === "branchId") {
      this.props.getCommonApi(`custappt/?Outlet=${value}`).then(key => {
        let { status, data } = key;
        if (status === 200) {
          for (let value of data) {
            customerList.push({
              value: value.id,
              label:
                value.cust_name +
                " | " +
                value.cust_phone1 +
                " | " +
                value.cust_code,
            });
          }
          this.setState({ customerList });
        }
      });
    }
    // this.props.updateForm('selected_customer', customerDetail)
  };

  handleCreateCart = () => {
    let { productCard, customerDetail, servicesDetail } = this.state;
    let { selected_cstomer } = this.props;
    console.log(
      servicesDetail,
      customerDetail,
      selected_cstomer,
      "sfdgsdfhshgf"
    );
    let payload = {
      cust_noid: selected_cstomer.cust_noid,
      cart_date: dateFormat(new Date(), "yyyy-mm-dd"),
      // lineno : 1,
      itemcodeid: selected_cstomer.branchId,
      quantity: customerDetail.quantity,
      price: servicesDetail.item_price,
    };
    this.props
      .getCommonApi(
        `itemcart/Check/?sitecodeid=${
          selected_cstomer.branchId
        }&cart_date=${dateFormat(new Date(), "yyyy-mm-dd")}&cust_noid=${
          selected_cstomer.cust_noid
        }`
      )
      .then(key => {
        let { status, data, error } = key;
        // if (status === 200) {
        console.log("asdfasdfasaff", data, payload);
        if (data.length > 0) {
          console.log("asdfasdfasaff == if", data, payload);
          this.props
            .commonCreateApi(
              `itemcart/?sitecodeid=${selected_cstomer.branchId}&cart_id=${data[0].cart_id}`,
              payload
            )
            .then(key => {
              let { status, data } = key;
              if (status === 201) {
                this.setState({ isOpenModal: false });
              }
            });
        } else {
          console.log("asdfasdfasaff == else", data, payload);
          this.props
            .commonCreateApi(
              `itemcart/?sitecodeid=${selected_cstomer.branchId}`,
              payload
            )
            .then(key => {
              let { status, data } = key;
              if (status === 201) {
                this.setState({ isOpenModal: false });
                history.push("/admin/catalog");
              }
            });
        }

        // }
      });
  };

  handleSearch = event => {
    event.persist();

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        let data = { search: searchString };
        // this.queryHandler(data)
        let { customerList, customerDetail } = this.state;
        this.props
          .getCommonApi(
            `custappt/?Outlet=${customerDetail.branchId}&search=${searchString}`
          )
          .then(key => {
            let { status, data } = key;
            if (status === 200) {
              // for (let value of data) {
              //     customerList.push({ value: value.id, label: value.emp_name })
              // }
              this.setState({ customerList: data });
            }
          });
      }, 500);
    }
    this.debouncedFn();
  };

  handleCloseDialog = () => {
    this.setState({
      isOpenModal: false,
    });
  };

  handleSelectCustomer = data => {
    let { customerList, customerDetail, servicesDetail } = this.state;
    customerDetail["cust_noid"] = data.id;
    customerDetail["cust_name"] = data.cust_name;
    this.setState({ customerDetail });
    // this.props.updateForm('selected_customer', customerDetail)
  };

  handleAddCart = async (data, price) => {
    await this.props.updateForm("selectedCart", data);
    // setTimeout(() => {
    // history.push("/admin/cart");
    this.props.handleAddCart(data, price);
    // }, 5000);
  };

  render() {
    let {
      servicesDetail,
      isOpenModal,
      branchList,
      customerList,
      customerDetail,
    } = this.state;
    let { selected_cstomer,t } = this.props;
    return (
      <>
        <div className="product-detail p-5">
          {servicesDetail ? (
            <div className="row">
              <div className="col-md-6">
                <div className="detail-view text-center">
                  <img width="230" src={servicesDetail.Stock_PIC} alt="" />
                </div>
              </div>
              <div className="col-md-5">
                <div className="product-left">
                  <p className="product-name fs-18">
                    {servicesDetail.item_desc}
                  </p>
                  <p className="fs-14 my-2">{servicesDetail.item_name}</p>

                  <div>
                    <p className="list-price fs-14">
                      {t("Price")}:
                      <span className="fs-16">
                        {" "}
                        $ {servicesDetail.item_price}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div>
                  <NormalButton
                    mainbg={true}
                    className="col-12 fs-15 mt-5"
                    label="Add to Cart"
                    onClick={() =>
                      this.handleAddCart(
                        servicesDetail,
                        servicesDetail.item_price
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  // customerDetail: state.appointment.customerDetail,
  selected_cstomer: state.common.selected_cstomer,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      commonCreateApi,
      updateForm,
    },
    dispatch
  );
};

export const ItemDetail =  withTranslation()(connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemDetailClass));
