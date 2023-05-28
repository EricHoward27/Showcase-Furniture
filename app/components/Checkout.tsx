import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { CardElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./CheckoutForm";

// Load Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
// Checkout component
const Checkout = () => {
// Define the client secret state, and set it to an empty string.
  const cartStore = useCartStore();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Define a function to call the create-payment-intent API endpoint.
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartStore.cart,
            payment_intent_id: cartStore.paymentIntent,
          }),
        });
        // If the response status is 403, redirect the user to the sign-in page.
        if (response.status === 403) {
          return router.push("/api/auth/signin");
        }
        const data = await response.json();
        setClientSecret(data.paymentIntent.client_secret);
        cartStore.setPaymentIntent(data.paymentIntent.id);
        // If the response status is 500, throw an error.
      } catch (error) {
        console.log(error);
        alert("Error occurred while creating payment intent.");
      }
    };
    // Call the createPaymentIntent function.
    createPaymentIntent();
  }, [cartStore, router]);
  // Define the options for the Elements component.
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  return (
    // If the client secret is defined, render the Elements component.
    <div>
      {clientSecret && (
        <div>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default Checkout;
