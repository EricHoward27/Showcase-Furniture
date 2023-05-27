"use client"
import {useState, useEffect} from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import formatPrice from "@/util/PriceFormat";
import TotalPrice from "@/util/TotalPrice";
import { StripeCardElement } from "@stripe/stripe-js";
import { useCartStore } from "@/store";

const CheckoutForm = ({clientSecret}: {clientSecret: string}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    // import the cart store
    const cartStore = useCartStore();
    // total price of items in cart util and the format price util to format the price
    const totalPrice = TotalPrice();
    const formattedPrice = formatPrice(totalPrice);
    // if no stripe init then return null and if no client secret return null
    useEffect(() => {
        if (!stripe || !clientSecret) {
            return;
        }
    },[stripe, clientSecret])

    // handle submit function using try catch to catch errors
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
        // Use the stripe.confirmCardPayment() method to submit the payment details to Stripe.
        const result = await stripe?.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements?.getElement(PaymentElement) as StripeCardElement,
            },
        });
          if(result?.error){
            // Handle Payment Errors
            console.log(result.error.message);
            alert(result.error.message);
          }  else {
            // Payment Success
            console.log("Payment Approved");
            // Redirect to the success page or perform some other action
            cartStore.setCheckout("success")
          }
        } catch (error) {
            // Handle general errors
            console.log(error);
            alert(error);
        }
        setIsLoading(false);
    }

    return ( 
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={{layout: "accordion"}}/>
            <h1>Total: {formattedPrice}</h1>
            <button id="submit" disabled={isLoading || !stripe || !elements }>
                <span id="button-text">
                    {isLoading ? <span>Processing</span> : <span>Pay now</span>}
                </span>
            </button>
        </form>
     );
}
 
export default CheckoutForm;
