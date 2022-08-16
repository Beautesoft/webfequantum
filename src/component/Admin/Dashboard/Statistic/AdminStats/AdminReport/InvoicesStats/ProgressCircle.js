import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const percentage = 750;
export class Progress extends React.Component {
    render() {
        return (
            <>
                <CircularProgressbar
                    value={percentage/10}
                    text={`${percentage}`}
                    styles={buildStyles({
                        rotation: 0,
                        strokeLinecap: 'round',
                        textSize: '30px',
                        pathTransitionDuration: 0.5,
                        pathColor: `rgba(255,0,0, ${percentage / 1000})`,
                        textColor: '#ff0000',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                    })}
                >
                    {/* <h2>750</h2> */}
                    </CircularProgressbar>
            </>
        );
    }
}
