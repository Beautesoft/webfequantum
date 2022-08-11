const API_ENDPOINT =
  "http://103.253.15.184:8107/api/stripepaymentintentconfirm";

export const stripePaymentMethodHandler = async (data, cb) => {
  const { amount, result, cartid, id, cust_id, cust_stripeid } = data;
  console.log("checking", result, cartid, amount, id, cust_id, cust_stripeid);
  if (result.error) {
    // show error in payment form
    cb(result);
  } else {
    const paymentResponse = await stripePayment({
      PaymentIntentId: id,
      cardNumber: result.paymentMethod.card.last4,
      expMonth: result.paymentMethod.card.exp_month,
      expYear: result.paymentMethod.card.exp_year,
      cvc: 123,
      paymentType: [result.paymentMethod.type],
      payment_method: "pm_card_visa",
      transactionId: cartid,
      amount: amount * 100,
      currency: "sgd",
      cust_noid: cust_id,
      customerId: cust_stripeid,
    });
    console.log(paymentResponse);
    cb(paymentResponse);
  }
};

// place backend API call for payment
const stripePayment = async (data) => {
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
