import React from 'react';
import "./style.scss";
import timeOption from 'data/calanderTime.json';

import PropTypes from 'prop-types';
import { Label } from 'reactstrap';

const getTopPx = (item) => {
    
    let hours = String(item.start_time).split(":")[0];
    let minute = String(Number(item.start_time.split(":")[1])/60*100)
    let pixal = Number(hours + (minute == "0" ? "00": minute))
    console.log("sdfhfgjhjfgjh top", hours, minute, pixal- 800)
   return pixal - 800;
}

const getHeightPx = (item) => {
    let hours = Number(String(item).split(":")[0])*100;
    let minute = Number(String(item).split(":")[1])/60*100
   let pixal = Number(hours + minute)
//    console.log("sdfhfgjhjfgjh", hours, minute, pixal, String(item).split(":"), (minute == "0" ? "00": minute))
   return pixal;
}

export const Events = ({
    datass,
    events = []
}) => {
    return (
        <div className="Scheduler-Event">
            <div className="user-profile text-center">
                <img width="81" height="81" src={datass.emp_pic} alt=""/>
                <p className="name">{datass.staff_name}</p>
                <p className="title">{datass.special}</p>
            </div>
            <div className="event">
                {
                    datass.event.map((item, index) => {
                        console.log(item, index, "sdffgjghjfghjfghj")
                        return (
                            <div className={`event-card`} style={{width:"200px",top:`${getTopPx(item)}px`, display:`${getTopPx(item)<0?'none':''}`,height:`${getHeightPx(item.duration)}px`, backgroundColor:item.color, zIndex:getTopPx(item), borderLeft:`8px solid ${item.border_color}`}}>
                                <p>{item.start_time} + {item.end_time}</p>
                                <p>{item.title}</p>
                                <p>{item.text}</p>
                            </div>
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
