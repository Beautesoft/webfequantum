// import React from "react";
// import "./index.scss";

// export const SwitchBox = ({ isOn, handleToggle, onColor }) => {
//   return (
//     <>
//       <div className="switch-component">
//         <input
//           checked={isOn}
//           onChange={handleToggle}
//           className="react-switch-checkbox"
//           id={`react-switch-new`}
//           type="checkbox"
//         />
//         <label
//           style={{ background: isOn && onColor }}
//           className="react-switch-label"
//           htmlFor={`react-switch-new`}
//         >
//           <span className={`react-switch-button`} />
//         </label>
//       </div>
//     </>
//   );
// };

import React from "react";
import "./index.scss";

export const SwitchBox = ({
  isOn,
  checked,
  handleToggle,
  value,
  onColor,
  id,
  name,
}) => {
  return (
    <>
      <div className="switch-component">
        <input
          checked={checked}
          name={name}
          //onChange={handleToggle}
          className="react-switch-checkbox"
          type="checkbox"
          id={name}
          onChange={({ target: { name, checked: Checked } }) => {
            handleToggle && handleToggle({ target: { name, value: Checked } });
          }}
        />
        <label
          style={{ background: checked && onColor }}
          className="react-switch-label"
          htmlFor={name}
        >
          <span className={`react-switch-button`} />{" "}
        </label>
      </div>
    </>
  );
};

// InputSearch.propTypes = {
//   onChange: PropTypes.func.isRequired,
//   className: PropTypes.string,
//   placeholder: PropTypes.string,
//   value: PropTypes.string,
// };
