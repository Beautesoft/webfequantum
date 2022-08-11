import React from "react";
import newUser from "assets/images/user-image.png";
class ResourceCell extends React.PureComponent {
  render() {
    const {
      data: {
        color,
        text,
        data: { emp_pic, staff_name },
      },
    } = this.props;
    return (
      <div className="dx-template-wrapper">
        <div className="name" style={{ background: color }}>
          <div className="col-12 d-flex justify-content-center">
            <img src={emp_pic ? emp_pic : newUser} className="avatar" />
          </div>
          <div className="col-12 d-flex justify-content-center">
            <p className="text-center pt-2">{staff_name}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ResourceCell;
