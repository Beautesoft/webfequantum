import React, { useState, useEffect } from "react";
import "./style.scss";
import PropTypes from "prop-types";
// import { useSelector } from 'react-redux';
import "moment/locale/it.js";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const NormalTimePicker = ({
  onChange,
  showTime = false,
  timeOnly = false,
  value,
  name = "",
  className,
  showYearDropdown = false,
  dateFormat,
  timeIntervals = 5,
  showIcon = true,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const handleDateSelect = date => {
    onChange(name, date);
    setStartDate(date);
  };

  return (
    <div className={`${className} date-picker`}>
      <DatePicker
        selected={value ? value : startDate}
        //onChange={date => handleDateSelect(date)}
        showTimeSelect={showTime}
        showTimeSelectOnly={timeOnly}
        timeIntervals={timeIntervals}
        // timeCaption="Time"
        dateFormat={dateFormat}
        showYearDropdown={showYearDropdown}
        onChange={date => {
          console.log(date);
          let body = {};

          body = {
            target: {
              value: date,
            },
          };

          onChange(body);
          setStartDate(date);
        }}
      />
      {showIcon ? (
        <span className="icon-calendar icon font-lg icon"></span>
      ) : null}
    </div>
  );
};

// export default RTDatepick;
NormalTimePicker.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};
