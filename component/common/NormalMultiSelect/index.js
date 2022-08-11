import React from "react";
import MenuPortal from "./model";
import Select from "react-select";
import { useTranslation } from "react-i18next";

export const NormalMultiSelect = ({
  options,
  handleMultiSelect,
  placeholder = "Select",
  className,
  name,
  value = [],
  ismulti = true,
  target,
}) => {
  let { t } = useTranslation();
  return (
    <div className={`position-relative w-100 multi-select ${className}`}>
      {console.log("dsfafsdfdfgdf, kuyiusdfsd", value, options)}
      <Select
        menuPortalTarget={target}
        placeholder={t(placeholder)}
        components={{ MenuPortal }}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        defaultValue={value}
        isMulti={ismulti}
        name={`${name}`}
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleMultiSelect}
      />
    </div>
  );
};
