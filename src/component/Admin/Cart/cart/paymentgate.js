import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { stripePaymentMethodHandler } from "./server";
import { Toast } from "service/toast";
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      lineHeight: "27px",
      color: "#212529",
      fontSize: "1.1rem",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
const API_ENDPOINT = "http://103.253.15.184:8107/api/stripecustomercreate";
const API_ENDPOINT1 =
  "http://103.253.15.184:8107/api/stripepaymentintentcreate";
export function Paymentcheckout(props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentid, setpaymentId] = useState(null);
  const [customer_id, setcustomer_id] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  let customercreate;
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    console.log(props.cust_id, props.cust_stripeid);

    if (props.cust_stripeid == null) {
      customercreate = await stripecustomer({
        cust_noid: props.cust_id,
      });
      setcustomer_id(customercreate.customer_id);
      console.log(customercreate.customer_id);
      if (customercreate.status !== 200) {
        Toast({
          type: "error",
          message: customercreate.message,
        });
      } else {
        const paymentintentcreate = await stripepaymentintentcreate({
          customerId:
            props.cust_stripeid == null
              ? customercreate.customer_id
              : props.cust_stripeid,
          amount: props.amount * 100,
          currency: "sgd",
        });
        if (paymentintentcreate.status !== 200) {
          Toast({
            type: "error",
            message: paymentintentcreate.message,
          });
        } else {
          setpaymentId(paymentintentcreate.result.id);
          console.log(paymentintentcreate);

          setLoading(true);
          setErrorMsg("");

          const paymentMethodObj = {
            type: "card",
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name,
              email,
            },
          };
          console.log(paymentMethodObj);
          const paymentMethodResult = await stripe.createPaymentMethod(
            paymentMethodObj
          );

          stripePaymentMethodHandler(
            {
              result: paymentMethodResult,
              amount: props.amount,
              cartid: props.cartId,
              id: paymentintentcreate.result.id,
              cust_id: props.cust_id,
              cust_stripeid: paymentintentcreate.result.customer,
            },

            handleResponse
          );
        }
      }
    } else {
      const paymentintentcreate = await stripepaymentintentcreate({
        customerId:
          props.cust_stripeid == null ? customer_id : props.cust_stripeid,
        amount: props.amount * 100,
        currency: "sgd",
      });
      setpaymentId(paymentintentcreate.result.id);
      console.log(paymentintentcreate);

      setLoading(true);
      setErrorMsg("");

      const paymentMethodObj = {
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name,
          email,
        },
      };
      console.log(paymentMethodObj);
      const paymentMethodResult = await stripe.createPaymentMethod(
        paymentMethodObj
      );
      if (paymentintentcreate.status == 200) {
        stripePaymentMethodHandler(
          {
            result: paymentMethodResult,
            amount: props.amount,
            cartid: props.cartId,
            id: paymentintentcreate.result.id,
            cust_id: props.cust_id,
            cust_stripeid: props.cust_stripeid,
          },

          handleResponse
        );
      } else {
        Toast({
          type: "error",
          message: paymentintentcreate.message,
        });
      }
    }
  };
  // callback method to handle the response
  const handleResponse = (response) => {
    console.log("Successfulll", response);
    setLoading(false);
    if (response.error) {
      setErrorMsg(response.error.message);
      return;
    }
    props.parentCallback(response.error ? null : true);
  };

  return (
    <>
      <React.Fragment>
        <h4 className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted">Pay with card</span>
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="cc-name">Customer Name</label>
              <input
                id="cc-name"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="cc-email">Email</label>
              <input
                id="cc-email"
                type="text"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mb-3">
              <label htmlFor="cc-number">Card Number</label>
              <CardNumberElement
                id="cc-number"
                className="form-control"
                options={CARD_ELEMENT_OPTIONS}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="expiry">Expiration Date</label>
              <CardExpiryElement
                id="expiry"
                className="form-control"
                options={CARD_ELEMENT_OPTIONS}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="cvc">CVC</label>
              <CardCvcElement
                id="cvc"
                className="form-control"
                options={CARD_ELEMENT_OPTIONS}
              />
            </div>
          </div>

          <hr className="mb-4" />
          <button
            className="btn btn-dark w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              ></div>
            ) : (
              `PAY ₹${props.amount}`
            )}
          </button>
          {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}
        </form>
      </React.Fragment>
    </>
  );
}

// place backend API call for payment
const stripecustomer = async (data) => {
  let token_id = localStorage.getItem("AuthToken");
  console.log(token_id);
  const res = await fetch(`${API_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "token" + " " + token_id,
    },

    body: JSON.stringify(data),
  });
  return await res.json();
};

// place backend API call for payment
const stripepaymentintentcreate = async (data) => {
  let token_id = localStorage.getItem("AuthToken");
  console.log(token_id);
  const res = await fetch(`${API_ENDPOINT1}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "token" + " " + token_id,
    },

    body: JSON.stringify(data),
  });
  return await res.json();
};
