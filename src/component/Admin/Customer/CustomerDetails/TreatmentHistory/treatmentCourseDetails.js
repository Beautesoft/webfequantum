import React, { Component } from 'react';
import "./style.scss";
// import { Appointments, TreatmentHistory, PurchaseHistory, PersonalDetails, Favourites } from './Details'
import classnames from 'classnames';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import { NormalInput, NormalButton, TableWrapper, NormalTextarea, NormalModal } from 'component/common';
import { FormGroup, Label, Input } from 'reactstrap';
import closeIcon from 'assets/images/close.png';

export class TreatmentCourseDetails extends Component {
  state = {
    formField: {
      reason: "",
      adjustment: ""
    },
    isOpenModal: false
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  handleCloseDialog = () => {
    let { isOpenModal } = this.state;
    isOpenModal = false;
    this.setState({
      isOpenModal
    })
  }

  render() {
    let { treatmentList, headerDetails, cartList, formField, isOpenModal } = this.state;
    let { reason, adjustment } = formField;
    return (

      <div className="treatment-account row">
        <div className="col-12 pb-3 treatment-table">
          <p className="my-2 fs-16 font-600">Reverse treatment</p>
          <div className="row header m-0 mt-2 fs-18">
            <div className="col-2 text-center">No</div>
            <div className="col-3">Treatment No</div>
            <div className="col-5">Content</div>
            <div className="col-2">Value</div>
          </div>
          <div className="row m-0 fs-14">
            <div className="col-2 text-center">...</div>
            <div className="col-3">Reverse list</div>
            <div className="col-5">HQRAFTOOCFD</div>
            <div className="col-2"></div>
          </div>
          <div className="row m-0 fs-18 font-600">
            <div className="col-2 text-center">No</div>
            <div className="col-3">Treatment #</div>
            <div className="col-5">Description</div>
            <div className="col-2">Price</div>
          </div>
          <div className="row m-0 fs-14">
            <div className="col-2 text-center">1.</div>
            <div className="col-3">TRMTRAFT110254862</div>
            <div className="col-5">
              <p>T00025266-C x 360 Glow treatment...</p>
              <p className="text-orenge">Total</p>
              <p className="text-orenge">Total deposit of balance</p>
              <p>Total credit Note to be received</p>
              <p className="fs-18 font-600">Adjustment value</p>
              <p>Penalty</p>
              <p className="text-orenge">Total credit Note after adjustment</p>
            </div>
            <div className="col-2">
              <p>$180.00</p>
              <p className="text-orenge">$180.00</p>
              <p className="text-orenge">$1440.00</p>
              <p>$180.00</p>
              <br></br>
              <p>$20.00</p>
              <p className="text-orenge">$160.00</p>
            </div>
          </div>
        </div>
        <div className="col-6 mt-2 pb-3">
          <div className="row">
            <div className="col-4 mt-2">Adjustment</div>
            <div className="col-8 adjustment mt-2 mb-2 d-flex">
              <FormGroup className="" check>
                <Label check>
                  <Input type="radio" name="radio1" />{' '}
                </Label>
              </FormGroup> {" + "}
              <FormGroup className="ml-2" check>
                <Label check>
                  <Input type="radio" name="radio1" />{' '}
                </Label>
              </FormGroup> {" - "}
              <div className="input-group ml-3">
                <NormalInput
                  placeholder="Enter here"
                  value={adjustment}
                  name="adjustment"
                  onChange={this.props.handleChange}
                />
              </div>
            </div>
            <div className="col-4 mb-2">Reason</div>
            <div className="col-8 mb-2 reason">
              <div className="input-group">
                <NormalInput
                  placeholder="Enter here"
                  value={reason}
                  name="reason"
                  onChange={this.props.handleChange}
                />
              </div>
            </div>
            <div className="col-4">Remarks</div>
            <div className="col-8 remark">
              <div className="input-group">
                <NormalTextarea
                  placeholder="Enter here"
                  value={reason}
                  name="reason"
                  onChange={this.props.handleChange}
                />
              </div>

            </div>
          </div>
        </div>
        <div className="col-6 mt-2 py-3">
          <div className="row">
            <div className="col-9 text-center">
              <NormalButton
                buttonClass={"update"}
                mainbg={true}
                className="col-12 fs-15 mt-2"
                label="Update"
                // outline={false}
                onClick={() => this.setState({ isOpenModal: true })}
              />
            </div>
            <div className="col-9 mt-5 text-center">
              <NormalButton
                buttonClass={"undo"}
                // mainbg={true}
                className="col-12 fs-15"
                label="Undo"
                outline={true}
                onClick={() => { }}
              />
            </div>
          </div>
        </div>
        <div className="col-12 action-bar custom-border pt-4 d-flex text-center">
          <NormalButton
            buttonClass={"cancel"}
            // mainbg={true}
            className="col-12 fs-15 mr-3"
            label="Cancel"
            // outline={false}
            onClick={() => this.props.handleShowDetail('live')}
          />
          <NormalButton
            buttonClass={"print"}
            // mainbg={true}
            className="col-12 fs-15 "
            label="Print"
            // outline={false}
            onClick={() => this.setState({ isOpenEditDisc: false })}
          />
        </div>

        <NormalModal className={"update-reverse"} style={{ minWidth: "605px" }} modal={isOpenModal} handleModal={this.handleCloseDialog}>
          <img onClick={this.handleCloseDialog} className="close" src={closeIcon} alt="" />
          <div className="row mt-2 mb-5 mx-3">

            <div className="col-12 pl-0 mt-3 fs-20 f-700 py-2 text-center">
              Credit Note reversed will be : $160.00
              </div>
            <div className="col-12 pl-0 mt-3 f-400 fs-20 py-2 text-center">
              Confirm to reverse
              </div>
            <div className="col-12 action-bar custom-border pt-4 d-flex text-center">
              <NormalButton
                buttonClass={"cancel"}
                // mainbg={true}
                className="col-12 fs-15 mr-5"
                label="No"
                // outline={false}
                onClick={() => this.handleCloseDialog()}
              />
              <NormalButton
                buttonClass={"print"}
                // mainbg={true}
                className="col-12 fs-15 "
                label="Yes"
                // outline={false}
                onClick={() => this.handleCloseDialog()}
              />
            </div>
          </div>
        </NormalModal>

      </div>
    )
  }
}
