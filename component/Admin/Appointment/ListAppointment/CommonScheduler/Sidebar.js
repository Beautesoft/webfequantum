import React from 'react';
import "./style.scss";
import timeOption from 'data/calanderTime.json';

import PropTypes from 'prop-types';

export const Sidebar = ({
    event=[],
    time=[]
}) => {
    return (
        <div className="Scheduler-time">
                <p className=" user-profile"></p>
                <div  className="event">
                {
                    timeOption.map((item, index)=>{
                        return(
                            <p className="time-slot">{item.label}</p>
                        )
                    })
                }
                </div>
        </div>
    );
};

// InputSearch.propTypes = {
//     onChange: PropTypes.func.isRequired,
//     className: PropTypes.string,
//     placeholder: PropTypes.string,
//     value: PropTypes.string,
// };
