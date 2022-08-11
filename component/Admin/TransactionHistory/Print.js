import React, { Component } from "react";
import { NormalButton, NormalSelect } from "component/common";
import "./style.scss";
export class PrintBill extends Component {
  state = {
    headLabel: [
      { label: "Date", value: "02.06.2020" },
      { label: "Time", value: "12.30 PM" },
      { label: "Bill number", value: "123456" },
      { label: "Billed by", value: "James" },
    ],
    billTable: [
      { label: "Service sales by", value: "Joanne – Consultant" },
      { label: "Treatment", value: "3E facial Treatment with Hot Masque" },
      { label: "QTY", value: "10 Sessions" },
      { label: "FOC", value: "2 sessions" },
      { label: "Unit Price", value: "$100" },
      { label: "1st Discount", value: "10%" },
      { label: "Discount on Discount", value: "5%" },
      { label: "1 session done today by", value: "Kim – therapist " },
    ],
    paymentDetails: [
      { label: "Payment Mode", value: "Pay on premise" },
      { label: "Amount paid", value: "$ 0" },
      { label: "Balance", value: "$ 138.57" },
      { label: "Pending", value: "$ 138.57" },
    ],
  };
  render() {
    let { headLabel, billTable, paymentDetails } = this.state;
    return (
      <>
        <div className="print-section container">
          <div className="print-bill">
            <div className="top-nav">
              {headLabel &&
                headLabel.map((data, index) => (
                  <div className="d-flex" key={index}>
                    <p>{data.label}</p>
                    <p>:</p>
                    <p>{data.value}</p>
                  </div>
                ))}
            </div>
            <div className="receipt card">
              <h3 className="bill-head">Customer Receipt</h3>
              <p className="receipt-detail">Tue, 02.06.2020 - 12.30pm </p>
              <p className="receipt-detail">Receipt #123456</p>
              <p className="receipt-detail">Service sales done by : JoanneF</p>
              <div className="bill-detail">
                <h4>Billing details</h4>
                <table className="table">
                  <tbody>
                    {billTable &&
                      billTable.map((data, index) => (
                        <tr key={index}>
                          <td>
                            <div className="label">{data.label}</div>
                          </td>
                          <td>
                            <div className="value">{data.value}</div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="payment-detail">
                <h4>Payment details</h4>
                {paymentDetails &&
                  paymentDetails.map((data, index) => (
                    <div className="d-flex payment" kay={index}>
                      <p className="label">{data.label}</p>
                      <p>:</p>
                      <p className="value">{data.value}</p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="pt-5 d-flex ">
              <div className="w-100 mr-4">
                <NormalButton label="Print" success={true} className="" />
              </div>
              <div className="w-100 ml-4">
                <NormalButton label="Share" className="" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
