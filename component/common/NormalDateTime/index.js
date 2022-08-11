import React, { useState, useEffect } from "react";
import "./style.scss";
import PropTypes from "prop-types";
// import { useSelector } from 'react-redux';
import "moment/locale/it.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

export const NormalDateTime = ({
  onChange,
  name = "",
  showTime = false,
  timeOnly = false,
  value,
  className,
  showYearDropdown = false,
  dateFormat,
  timeIntervals = 5,
  showIcon = true,
  showMonthYearPicker,
  minDate,
  maxDate,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const handleDateSelect = date => {
    onChange(name, date);
    setStartDate(date);
  };
  let { t } = useTranslation();
  return (
    <div className={`${className} date-picker`}>
      <DatePicker
        selected={value ? value : startDate}
        onChange={date => handleDateSelect(date)}
        showTimeSelect={showTime}
        showTimeSelectOnly={timeOnly}
        timeIntervals={timeIntervals}
        // timeCaption="Time"
        minDate={minDate}
        maxDate={maxDate}
        dropdownMode="select"
        dateFormat={dateFormat}
        showYearDropdown={showYearDropdown}
        showMonthYearPicker={showMonthYearPicker}
      />
      {showIcon ? (
        <span className="icon-calendar icon font-lg icon"></span>
      ) : null}
    </div>
  );
};

// export default RTDatepick;
NormalDateTime.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};
