// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {NormalSelect} from 'component/common';

// export default class BarChart extends React.Component {
    
//     render() {
//         return (
//             <div className="">
                
//                 <Bar
//                     data={this.props.data}
//                     options={{
                        
//                         legend: {
//                             display: false,
//                             position: 'left'
//                         }
//                     }}
//                 />
//             </div>
//         );
//     }
// }

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const CountryChart = (props) => {
    return(
        <>
            <HighchartsReact highcharts={Highcharts} options={props.options}></HighchartsReact>
        </>
    );
}

export default CountryChart;