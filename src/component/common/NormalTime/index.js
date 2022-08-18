// import React, { Component } from 'react';
// import ReactDateTime from 'react-datetime';
// import 'react-datetime/css/react-datetime.css';
// // import './style.scss';
// import moment from 'moment';

// export class NormalTime extends Component {
//   state = {
//     defaultValue: '',
//     stateChanged: false,
//   };

//   componentDidMount() {
//     let { value } = this.props;

//     if (value && !this.state.stateChanged) {
//       this.setState({
//         defaultValue:
//           typeof value === 'string' && value.indexOf('T') !== -1 && value.indexOf('Z') !== -1 ? moment(value) : value,
//         stateChanged: true,
//       });
//     }
//   }

//   componentWillReceiveProps({ value, name, isControlled }) {
//     if (value && !this.state.stateChanged) {
//       this.setState(
//         {
//           defaultValue:
//             typeof value === 'string' && value.indexOf('T') !== -1 && value.indexOf('Z') !== -1 ? moment(value) : value,
//           stateChanged: true,
//         },
//         () => {
//           if (
//             !moment(value, 'MM/DD/YYYY hh:mm a', true).isValid() &&
//             !moment(value, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid() &&
//             !moment(value, 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid()
//           ) {
//             this.refs.dateInput.querySelector('input').focus();
//           }
//         },
//       );
//     }

//     if (isControlled) {
//       this.setState({
//         defaultValue: moment(value),
//       });
//     }
//   }

//   getTimeConstrain = () => {
//     let dateTime = ReactDateTime.moment();

//     return {
//       hours: {
//         min: dateTime.hours(),
//         max: 23,
//         step: 1,
//       },
//       minutes: {
//         min: dateTime.minutes(),
//         max: 59,
//         step: 1,
//       },
//     };
//   };

//   changeDateBasedOnSelection = date => {
//     // let { timeConstrainParams, value } = this.props

//     // if (!moment(date).isSame(value, 'day') && moment(timeConstrainParams).isSame(date, 'day')) {
//     //     return moment(timeConstrainParams).add(15, 'minutes')
//     // }

//     return date;
//   };

//   render() {
//     let {
//       placeholder = '',
//       value = '',
//       isControlled = false,
//       // timeConstrainParams,
//       // timeConstraints,
//       onChange,
//       name = '',
//       disabled = false,
//       isValidDate = e => true,
//       timeFormat = true,
//       dateFormat = false,
//       className = 'form-control',
//     } = this.props;

//     let { defaultValue, stateChanged } = this.state;

//     // value = ReactDateTime.moment(defaultValue)

//     return (
//       <div className="date-input-wrapper w-100" ref="dateInput">
//           <ReactDateTime 
//           dateFormat={dateFormat}
//           selected={value}
//           onChange={date => {
//             let body = {};

//             body = {
//               target: {
//                 name: name,
//                 value: date

//               },
//             };

//             onChange(body);

//           }}
//           name={name}
//           />
//         {/* {!isControlled ? (
//           <ReactDateTime
//             inputProps={{
//               placeholder,
//               className,
//               disabled,
//               // readOnly: true
//             }}
//             key={stateChanged}
//             defaultValue={defaultValue}
//             isValidDate={isValidDate}
//             // utc={true}
//             onChange={date => {
//               onChange(
//                 name,
//                 moment(date, 'MM/DD/YYYY hh:mm a', true).isValid()
//                   ? moment(date)
//                       .utc()
//                       .format()
//                   : date,
//               ); //
//             }}
//             dateFormat={dateFormat}
//             timeFormat={timeFormat}
//           />
//         ) : (
//           <ReactDateTime
//             inputProps={{
//               placeholder,
//               className,
//               disabled,
//               // readOnly: true
//             }}
//             key={stateChanged}
//             value={defaultValue}
//             isValidDate={isValidDate}
//             // utc={true}
//             onChange={date => {
//               onChange(
//                 name,
//                 moment(date, 'MM/DD/YYYY hh:mm a', true).isValid()
//                   ? moment(date)
//                       .utc()
//                       .format()
//                   : 
//                   date,
//               ); //
//             }}
//             timeFormat={timeFormat}
//             dateFormat={dateFormat}
//           />
//         )} */}


//       </div>
//     );
//   }
// }


// import React, { useState } from 'react';
// import TimePicker from 'react-time-picker';

// function NormalTime() {
//   const [value, onChange] = useState('10:00');

//   return (
//     <div>
//       <TimePicker
//         onChange={onChange}
//         value={value}
//       />
//     </div>
//   );
// }
// export default NormalTime;

import React, { Component } from 'react';
import TimePicker from 'react-time-picker';
 
export class NormalTime extends Component {
  render() {
    let{
      value,
      onChange,
      name
    } = this.props
  // state = {
  //   time: '10:00',
  // }
 
  // onChange = time => this.setState({ time })
 
    return (
      <div>
        <TimePicker
          // onChange={this.onChange}
          // value={this.state.time}
          value={value}
          onChange={(e)=>console.log(e, "kjdfsdjfsdf")}
        />
      </div>
    );
  }
}