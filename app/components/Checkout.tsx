"use client"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { CardElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Load Stripe.js and the required React bindings
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Set up Stripe.js and the Elements provider
const Checkout = () => {
   const cartStore = useCartStore();
   const router = useRouter();
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
            // Handle server response if status is 403 redirect to signin page
            if (res.status === 403) {
                return router.push("/api/auth/signin");
            } 
           return res.json();
    
        }).then((data) => {
            console.log(data)
        })
    } catch (error) {
        console.log(error)
        alert(error)
        
    }
   
  

   }, [])

    return (
        <div>
            <h1>Checkout</h1>
        </div>
    )
}

 
export default Checkout;