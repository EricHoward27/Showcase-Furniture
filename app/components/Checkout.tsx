"use client"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { CardElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./CheckoutForm";

// Load Stripe.js and the required React bindings
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Set up Stripe.js and the Elements provider
const Checkout = () => {
   const cartStore = useCartStore();
   const router = useRouter();
   const [clientSecret, setClientSecret] = useState("");

   useEffect(() => {
    const createPaymentIntent = async () => {
    try {
         // Create PaymentIntent as soon as the page loads use try catch to catch errors
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                items: cartStore.cart,
                payment_intent_id: cartStore.paymentIntent,
            }),
        }) .then((res) => {
            // Handle server response if status is 403 redirect to signin page
            if (res.status === 403) {
                return router.push("/api/auth/signin");
            } 
           return res.json();
            // use client secret to confirm payment and complete transaction
        }).then((data) => {
            setClientSecret(data.paymentIntent.client_secret)
            cartStore.setPaymentIntent(data.paymentIntent.id)
        })
    } catch (error) {
        console.log(error)
        alert(error)
        
    }
};
createPaymentIntent();
  
}, [cartStore, router]);

const options: StripeElementsOptions ={
    clientSecret,
    appearance: {
        theme: "stripe",
        labels: "floating",
    },

}
    return (
        <div>
            {clientSecret && (
                <div>
                    <Elements options={options} stripe={stripePromise}>
                       <CheckoutForm clientSecret={clientSecret} />
                    </Elements>
                </div>
            )}
        </div>
    )
}

 
export default Checkout;