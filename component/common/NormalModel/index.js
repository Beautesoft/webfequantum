import React, { Component } from "react";
import { Modal, ModalBody } from 'reactstrap';
import './style.scss';

export class NormalModal extends Component {
  state = {
    madal: false
  }

  toggle = () => {
    this.props.handleModal();
  }

  render() {
    let {
      className = "",
      buttonLabel = "",
      modal = false,
      style = {}
    } = this.props;

    return (
      <div>
      <Modal isOpen={modal} toggle={this.toggle} style={style} className={className}>
        <ModalBody>
         {this.props.children}
        </ModalBody>
      </Modal>
    </div>
    );
  }
}
