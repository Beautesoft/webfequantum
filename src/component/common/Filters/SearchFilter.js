import React from "react";
import { InputSearch } from "../../../component/common";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const SearchFilter = ({
  queryHandler,
  value = "",
  handleChange = "",
  placeHolder = "Search",
  inputClassName = "",
  className = "",
}) => {
  const handleSearch = (e) => {
    let {
      target: { value },
    } = e;

    handleChange && handleChange(e);

    queryHandler && queryHandler({ search: value, page: 1 });
  };
  let { t } = useTranslation();
  return (
    <div className="d-flex align-items-center">
      {value ? (
        <InputSearch
          className={className}
          inputClassName={inputClassName}
          onChange={handleSearch}
          value={value}
          placeholder={t(placeHolder)}
        />
      ) : (
        <InputSearch
          className={className}
          inputClassName={inputClassName}
          onChange={handleSearch}
          placeholder={t(placeHolder)}
        />
      )}
    </div>
  );
};

SearchFilter.propTypes = {
  queryHandler: PropTypes.func.isRequired,
  placeHolder: PropTypes.string,
};
