import React, { useState } from "react";
import { Collapse } from "reactstrap";

const Availability = ({ availability }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="side-menus">
      <div color="primary" onClick={toggle}>
        <div className="row  pt-3">
          <div className="col-2 p-0 text-right time profile">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="20" fill="$primary-color" />
              <path
                d="M15.9593 27.492V26.498C16.538 26.6007 16.9953 26.624 17.3313 26.568C17.6673 26.5213 17.9053 26.358 18.0453 26.078C18.1853 25.8073 18.2553 25.3967 18.2553 24.846V15.032H19.4033V24.86C19.4033 25.6347 19.2913 26.2367 19.0673 26.666C18.8433 27.1047 18.4793 27.3847 17.9753 27.506C17.4713 27.6367 16.7993 27.632 15.9593 27.492ZM20.2933 27.492V26.498C20.8719 26.6007 21.3293 26.624 21.6653 26.568C22.0013 26.5213 22.2393 26.358 22.3793 26.078C22.5193 25.8073 22.5893 25.3967 22.5893 24.846V15.032H23.7373V24.86C23.7373 25.6347 23.6253 26.2367 23.4013 26.666C23.1773 27.1047 22.8133 27.3847 22.3093 27.506C21.8053 27.6367 21.1333 27.632 20.2933 27.492Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="col-8 detail">
            <p className="title m-0 fs-14 f-600">{availability.emp_name}</p>
            <p className="head-message m-0 fs-12">{availability.job_title}</p>
          </div>
          <div className="col-1 p-0">
            <svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L7 7L13 1"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <Collapse isOpen={isOpen}>
        <div className="col-12 text-center fs-12">
          <div className="col-8 detail">{availability.value}</div>
          <div className="col-12 m-2 detail">
            {availability.appointment.map((app, index) => (
              <div className="d-flex flex-wrap" key={index}>
                <div className="head-message mb-0 col-5">{app.time}</div>
                <div className="head-message mb-0 col-7">{app.cust_name}</div>
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Availability;
