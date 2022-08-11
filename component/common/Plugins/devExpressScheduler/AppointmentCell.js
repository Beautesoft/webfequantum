import dxPivotGridFieldChooser from "devextreme/ui/pivot_grid_field_chooser";
import React from "react";
import calander from "assets/images/app-icons/00.png";
import outstanding from "assets/images/app-icons/0.png";
import req_therapist from "assets/images/app-icons/1.png";
import treatmentbal from "assets/images/app-icons/2.png";
import birthday from "assets/images/app-icons/3.png";
import new_remark from "assets/images/app-icons/4.png";
import storecard from "assets/images/app-icons/5.png";
import walkin from "assets/images/app-icons/6.png";

import "./Styles.scss";

const getTime = date => {
  var now = new Date(date);
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var ap = "AM";
  if (hour > 11) {
    ap = "PM";
  }
  if (hour > 12) {
    hour = hour - 12;
  }
  if (hour == 0) {
    hour = 12;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }
  var timeString = hour + ":" + minute + " " + ap;
  return timeString;
};

export default function Appointment(model) {
  const { appointmentData } = model.data;
  let fromTime = getTime(appointmentData.startDate);
  let toTime = getTime(appointmentData.endDate);
  let borderStyle = "1px solid" + appointmentData.border_color;
  return (
    <div
      className="display-box p-0"
      style={{
        background: appointmentData.color,
        border: borderStyle,
      }}
    >
      {appointmentData.status && appointmentData.status === "Block" ? (
        <div className="d-flex">
          <div className="col-12 col-sm-12 col-md-12">
            <div className="app-detail">
              <p>{appointmentData.reason}</p>
              <p className="text-uppercase">
                {appointmentData.text} ({fromTime}
                {" - "}
                {toTime})
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex">
          <div className="col p-0 ml-1">
            {appointmentData.link_flag ? (
              <div className="pt-1">
                <span className="tooltip-img">
                  <span>
                    <span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="7"
                          cy="8"
                          r="7"
                          fill="rgba(60, 64, 135, 0.31)"
                          stroke="#3C4087"
                        ></circle>
                        <text x="5" y="12" fill="#3C4087">
                          L
                        </text>
                      </svg>
                    </span>
                  </span>
                  <div className="tooltiptext-img text-left">
                    <p>{`Linked Appointment`}</p>
                  </div>
                </span>
              </div>
            ) : (
              ""
            )}
            {appointmentData.inital ? (
              <div className="pt-1">
                <span className="tooltip-img">
                  <img src={calander} />
                  <div className="tooltiptext-img text-left">
                    <p>
                      [{fromTime}
                      {" - "}
                      {toTime}]
                    </p>
                    <p>{appointmentData.cust_name}</p>
                    <p>{appointmentData.cust_phone}</p>
                    <p>{appointmentData.status}</p>
                  </div>
                </span>
              </div>
            ) : (
              ""
            )}
            {appointmentData.outstanding ? (
              <div className="pt-1">
                <span className="tooltip-img">
                  <img src={outstanding} />
                  <span className="tooltiptext-img">
                    <p>{`Outstanding $${appointmentData.outstanding_amt}`}</p>
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
            {appointmentData.req_therapist ? (
              <div className="pt-1">
                <span className="tooltip-img">
                  <img src={req_therapist} />
                  <span className="tooltiptext-img">
                    <p>{`Request Therapist`}</p>
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
            {appointmentData.balance ? (
              <div className="pt-1">
                <span className="tooltip-img">
                  <img src={treatmentbal} />
                  <span className="tooltiptext-img">
                    <p>{`Have balance for Treatment or Product`}</p>
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
            {appointmentData.birthday ? (
              <div className="pt-1">
                <span className="tooltip-img">
                  <img src={birthday} />
                  <span className="tooltiptext-img">
                    <p>{`Birthday Month`}</p>
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
            {appointmentData.remark ? (
              <div className="pt-1">
                <span className="tooltip-img">
                  <img src={new_remark} />
                  <span className="tooltiptext-img">
                    <p>{appointmentData.remark_val}</p>
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
            {appointmentData.permanent_remark != "" ? (
              <div className="pt-1">
                <span className="tooltip-img">
                  <img src={new_remark} />
                  <span className="tooltiptext-img">
                    <p>{appointmentData.permanent_remark}</p>
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
            {/* <div className="pt-1">
          <span className="tooltip-img">
            <img src={storecard}  />
            <span className="tooltiptext-img">
              <p >{appointmentData.text}</p>
            </span>
          </span>
        </div>
        */}
            {appointmentData.walkin ? (
              <div className="pt-1">
                <span className="tooltip-img">
                  <img src={walkin} />
                  <span className="tooltiptext-img">
                    <p>{`Walkin`}</p>
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="app-detail col-11 col-sm-11 col-md-11 p-0 ml-2">
            <p>
              {fromTime}
              {" - "}
              {toTime}
            </p>
            <p>{appointmentData.cust_name}</p>
            <p>{appointmentData.cust_refer}</p>
            <p>
              {appointmentData.cust_code}&ensp;{appointmentData.gender}{" "}
              {appointmentData.gender ? "/" : ""}
              {appointmentData.age}
            </p>
            <p>
              {appointmentData.cust_phone}&nbsp;
              {appointmentData.cust_phone1 ? "/" : ""}
              &nbsp;{appointmentData.cust_phone1}
            </p>
            <p>{appointmentData.sec_status}</p>
            <p>{appointmentData.room}</p>
            <p>{appointmentData.appt_remark}</p>
          </div>
        </div>
      )}
    </div>
  );
}
