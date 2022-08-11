import React from 'react';
import {Line} from 'react-chartjs-2';


export default class LineChart extends React.Component {
  render() {
    return (
      <div>
        <Line
          data={this.props.data}
          width={100}
          height={40}
          options={{
            legend:{
              display:false,
              position:'right'
            }
          }}
        />
      </div>
    );
  }
}