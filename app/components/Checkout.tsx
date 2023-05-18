"use client"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { CardElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store";
import { useState, useEffect } from "react";

// Load Stripe.js and the required React bindings
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Set up Stripe.js and the Elements provider
const Checkout = () => {
   const cartStore = useCartStore();
   const [clientSecret, setClientSecret] = useState("");

   useEffect(() => {
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
            console.log(res)
            // Set the client secret and the paymnent intent associated with it
    
        })
    } catch (error) {
        console.log(error)
        alert(error)
        
    }
   
  

   }, [])
}

 
export default Checkout;