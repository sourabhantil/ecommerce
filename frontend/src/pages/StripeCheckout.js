import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import StripeCheckoutForm from "./StripeCheckoutForm";
import { useSelector } from "react-redux";
import { selectCurrentOrder } from "../features/order/orderSlice";
import "../Stripe.css"
const HOST = process.env.REACT_APP_API_HOST || "";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51NbjJASHNMrFtO0S8t8kxSBunrlan4fZZuNPndNV9yCU7RBHKvmQNVWq8LWJWUfmcHMjNfInrW5bRtBGazABBzYt00MrECzKYP");

export default function StriperCheckout() {
    const currentOrder = useSelector(selectCurrentOrder);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(HOST+"/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalAmount: currentOrder.totalAmount,orderId:currentOrder.id }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="Stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <StripeCheckoutForm />
        </Elements>
      )}
    </div>
  );
}