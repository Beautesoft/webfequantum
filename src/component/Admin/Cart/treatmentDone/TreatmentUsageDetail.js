import { NormalInput, NormalSelect, NormalButton } from "component/common";
import React, { Component } from "react";
import {
  getCommonApi,
  commonCreateApi,
  commonPatchApi,
} from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export class TreatmentUsageDetailClass extends Component {
  state = {
    treatmentDetailFace: {
      id: 0,
      str1: "",
      str2: "",
      str3: "",
      str4: "",
      str5: "",
      room_id: "",
      remarks: "",
      treatment_code: "",
    },
    TreatmentHistoryId: 0,
    treatmentDetailId: 0,
    RoomList: [],
    remarks: "",
  };

  componentDidMount = () => {
    this.getRoomList();
    this.getTreatmentUsageDetailTabInfo(this.props.TreatmentHistoryId);
  };

  getTreatmentUsageDetailTabInfo = async TreatId => {
    await this.setState({
      TreatmentHistoryId: this.props.TreatmentHistoryId,
      treatment_code: this.props.treatment_code,
      remarks: this.props.remarks,
    });
    let { treatmentDetailFace } = this.state;
    this.props
      .getCommonApi(`treatmentface/?treat_id=${TreatId}`)
      .then(async key => {
        let { status, data } = key;
        if (status === 200) {
          if (data) {
            treatmentDetailFace["str1"] = data.str1;
            treatmentDetailFace["str2"] = data.str2;
            treatmentDetailFace["str3"] = data.str3;
            treatmentDetailFace["str4"] = data.str4;
            treatmentDetailFace["str5"] = data.str5;
            // treatmentDetailFace["room_id"] = data.room_id;
            await this.setState({
              treatmentDetailFace,
              treatmentDetailId: data.id,
            });
          }
        }
      });
  };
  handlechange = ({ target: { name, value } }) => {
    let { treatmentDetailFace } = this.state;
    treatmentDetailFace[name] = value;
    this.setState({
      treatmentDetailFace,
    });
  };

  cleartext = () => {
    this.setState({
      treatmentDetailFace: "",
    });
  };

  handleTreatmentUsageDetailSave = detail => {
    let { TreatmentHistoryId, remarks } = this.state;
    let Body = {
      treatment_code: this.props.treatment_code,
      str1: detail.str1,
      str2: detail.str2,
      str3: detail.str3,
      str4: detail.str4,
      str5: detail.str5,
      room_id: "",
      treat_remarks: this.props.remarks,
    };
    this.props
      .commonCreateApi(`treatmentface/?treat_id=${TreatmentHistoryId}`, Body)
      .then(async res => {
        if (res.status === 200) {
          this.getTreatmentUsageDetailTabInfo(TreatmentHistoryId);
        }
      });
  };

  handleTreatmentUsageDetailUpdate = detail => {
    let { TreatmentHistoryId, treatmentDetailId } = this.state;
    let Body = {
      treatment_code: this.props.treatment_code,
      str1: detail.str1,
      str2: detail.str2,
      str3: detail.str3,
      str4: detail.str4,
      str5: detail.str5,
      room_id: detail.room_id,
      treat_remarks: this.props.remarks,
    };
    this.props
      .commonPatchApi(
        `treatmentface/${treatmentDetailId}/?treat_id=${TreatmentHistoryId}`,
        Body
      )
      .then(async res => {
        if (res.status === 200) {
          this.getTreatmentUsageDetailTabInfo(TreatmentHistoryId);
        }
      });
  };
  getRoomList = () => {
    let { RoomList } = this.state;
    this.props.getCommonApi(`room/`).then(async key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          RoomList.push({
            value: value.id,
            label: value.displayname,
          });
        }
        await this.setState({ RoomList });
      }
    });
  };
  render() {
    let { treatmentDetailFace, treatmentDetailId, RoomList } = this.state;
    let { str1, str2, str3, str4, str5, room_id } = treatmentDetailFace;

    return (
      <div className="d-flex flex-column p-2 m-2 mt-2">
        <div className="my-2 w-100 col-6">
          <NormalInput
            name="str1"
            onChange={e => this.handlechange(e)}
            value={str1}
          />
        </div>
        <div className="my-2 w-100 col-6">
          <NormalInput
            name="str2"
            onChange={e => this.handlechange(e)}
            value={str2}
          />
        </div>
        <div className="my-2 w-100 col-6">
          <NormalInput
            name="str3"
            onChange={e => this.handlechange(e)}
            value={str3}
          />
        </div>
        <div className="my-2 w-100 col-6">
          <NormalInput
            name="str4"
            onChange={e => this.handlechange(e)}
            value={str4}
          />
        </div>
        <div className="my-2 w-100 col-6">
          <NormalInput
            name="str5"
            onChange={e => this.handlechange(e)}
            value={str5}
          />
        </div>
        {/* <div className="my-2 w-100 col-3">
          <NormalSelect
            name="room_id"
            options={RoomList}
            onChange={e => this.handlechange(e)}
            value={room_id}
            placeholder={`Select Room`}
          />
        </div> */}
        <div className="row text-center justify-content-start w-100 mt-3">
          {treatmentDetailId && treatmentDetailId > 0 ? (
            <>
              <NormalButton
                buttonClass={"col-2"}
                mainbg={true}
                className="col-12 ml-4 fs-15 "
                label="Update"
                onClick={() =>
                  this.handleTreatmentUsageDetailUpdate(treatmentDetailFace)
                }
              />
            </>
          ) : (
            <NormalButton
              buttonClass={"col-2"}
              mainbg={true}
              className="col-12 ml-4 fs-15 "
              label="Save"
              onClick={() =>
                this.handleTreatmentUsageDetailSave(treatmentDetailFace)
              }
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // filter: state.dashboard
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
      commonPatchApi,
    },
    dispatch
  );
};

export const TreatmentUsageDetail = connect(
  mapStateToProps,
  mapDispatchToProps
)(TreatmentUsageDetailClass);
