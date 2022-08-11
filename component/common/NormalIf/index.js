import React from 'react';
import PropTypes from 'prop-types';

export class NormalIf extends React.Component {
    render() {
        if (this.props.isShow) {
            return (
                this.props.children
            );
        } else {
            return null
        }
    }
}
NormalIf.propTypes={
    children: PropTypes.element.isRequired
}