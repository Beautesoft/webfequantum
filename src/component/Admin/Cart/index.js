import React, { Component } from "react";
import "./style.scss";
import { NormalButton } from "component/common";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";

export class CartClass extends Component {
  state = {
    isOpen: false,
    currentIndex: -1,
    cartList: [],
    cartData: {},
  };

  componentDidMount = () => {
    // this.getCart()
  };

  getCart = () => {
    let { productCard, cartList } = this.state;
    let { selected_cstomer } = this.props;
    // this.props.getCommonApi(`itemcart/Check/?sitecodeid=${selected_cstomer.branchId}&cart_date=${"2020-09-17"}&cust_noid=${selected_cstomer.cust_noid}`).then((key) => {
    this.props
      .getCommonApi(
        `itemcart/Check/?sitecodeid=${
          selected_cstomer.branchId
        }&cart_date=${dateFormat(new Date())}&cust_noid=${
          selected_cstomer.cust_noid
        }`
      )
      .then((key) => {
        let { status, data } = key;
        if (status === 200) {
          this.props
            .getCommonApi(
              `itemcart/?sitecodeid=${
                selected_cstomer.branchId
              }&cart_date=${dateFormat(new Date())}&cust_noid=${
                selected_cstomer.cust_noid
              }&cart_id=${data[0].cart_id}`
            )
            .then((res) => {
              // this.props.getCommonApi(`itemcart/?sitecodeid=${selected_cstomer.branchId}&cart_date=${"2020-09-17"}&cust_noid=${selected_cstomer.cust_noid}&cart_id=${data[0].cart_id}`).then((res) => {
              let { status, data } = res;
              if (status === 200) {
                this.setState({ cartList: data, cartData: res });
              }
            });
        }
      });
  };

  handleOpen = async () => {
    let { isOpen } = this.state;
    await this.setState({
      isOpen: !isOpen,
    });
    if (isOpen === false) {
      this.getCart();
    }
  };

  handleClick = (key) => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState((prevState) => ({
      active: !prevState.active,
      currentIndex: key,
    }));
  };

  getDateTime = (data) => {
    let date = new Date(data);
    date = String(date).split(" ");
    let date1 = date[2] + "th " + date[1] + ", " + date[3];
    let time = date[4].split(":");
    let time1 =
      String(Number(time[0]) > 12 ? Number(time[0]) - 12 : time[0]) +
      ":" +
      time[1] +
      (Number(time[0]) > 12 ? "PM" : "AM");
    return time1 + ", " + date1;
  };

  handleSubmit = (id) => {
    history.push(`/admin/payment/${id}`);
  };

  render() {
    let { isOpen, currentIndex, cartList, cartData } = this.state;
    return (
      <>
        <div className={`cart-holder ${isOpen ? "open" : ""}`}>
          <div className="cart-head">
            <i
              className="icon-left-arrow"
              onClick={() => this.handleOpen()}
            ></i>
            <p>Cart</p>
          </div>
          <div className={`${!isOpen ? "item-list" : ""}`}>
            {isOpen ? (
              <div className="row item-list-detail">
                <div className="col-9 list">
                  <div className="row my-2">
                    <div className="col-4 text-center">Treatment</div>
                    <div className="col-2 text-center">Cost</div>
                    <div className="col-2 text-center">Quantity</div>
                    <div className="col-2 text-center">Booking Detail</div>
                    <div className="col-2 text-center"></div>
                  </div>
                  {cartList.map((item, index) => {
                    let {
                      name,
                      staffId,
                      specialist,
                      homeSite,
                      currentSite,
                      contact,
                      status,
                    } = item;
                    return (
                      <div className="row detail m-2" key={index}>
                        <div className="col-4 treatment">
                          <p className="title mb-2">{item.itemdesc}</p>
                          <p className="sub-title mb-2">{item.item_class}</p>
                          <p className="time">
                            {item.cart_date
                              ? this.getDateTime(item.cart_date)
                              : ""}
                            , {item.sitecode_name}
                          </p>
                        </div>
                        <div className="col-2 cost">$ {item.total_price}</div>
                        <div className="col-2 quantity">{item.quantity}</div>
                        <div className="col-2 booking">$ {item.deposit}</div>
                        <div className="col-2 action">
                          <div
                            className="position-relative"
                            ref={(node) => {
                              this.node = node;
                            }}
                            onClick={() => this.handleClick(index)}
                          >
                            {currentIndex === index ? (
                              <>
                                <div className="d-flex align-items-center justify-content-center horizontal-more-active">
                                  <i className="icon-more"></i>
                                </div>
                                <div className="option card">
                                  <div
                                    className="d-flex align-items-center fs-16 pt-3"
                                    onClick={() =>
                                      this.props.history.push(
                                        "/admin/staff/staffDetails"
                                      )
                                    }
                                  >
                                    <span className="icon-eye-grey px-3"></span>{" "}
                                    View{" "}
                                  </div>
                                  <div className="d-flex align-items-center fs-16">
                                    <span className="icon-edit px-3"></span>{" "}
                                    Edit{" "}
                                  </div>
                                  <div className="d-flex align-items-center fs-16 pb-3">
                                    <span className="icon-delete px-3"></span>{" "}
                                    Delete{" "}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="d-flex align-items-center justify-content-center horizontal-more">
                                <i className="icon-more"></i>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="col-3 billable-amount">
                  <div className="row">
                    <div className="col-6">Subtotal</div>
                    <div className="col-6">$ {cartData.subtotal}</div>
                    {/* <div className="col-6">Tax</div>
                                    <div className="col-6">$ 20</div> */}
                    <div className="col-6">Discount</div>
                    <div className="col-6">$ {cartData.discount}</div>
                    {/* <div className="col-6">Voucher</div>
                                    <div className="col-6"></div> */}
                  </div>
                  <div className="right-total text-center">
                    <p className="label">Billable Amount</p>
                    <p className="amount text-orenge">$ {cartData.trans_amt}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>No Items available</p>
            )}
          </div>
          <div className="total">
            <p>Total</p>
            <p>$ {cartData.trans_amt}</p>
          </div>
          <div className="confirm-booking">
            <NormalButton
              buttonClass={"treatment"}
              mainbg={true}
              className="col-12 fs-15 "
              label="Checkout to payment"
              onClick={
                cartList.length > 0
                  ? () => this.handleSubmit(cartList[0].cart_id)
                  : ""
              }
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  customerDetail: state.appointment.customerDetail,
  selected_cstomer: state.common.selected_cstomer,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
    },
    dispatch
  );
};

export const Cart = connect(mapStateToProps, mapDispatchToProps)(CartClass);
