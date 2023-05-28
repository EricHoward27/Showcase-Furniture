"use client"
import {useState, useEffect} from "react";
import { PaymentElement, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
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
            // if no stripe or elements throw error
            if (!stripe || !elements) {
                throw new Error("Stripe or Elements not available.");
              }
            // get the card element
            const cardElement = elements?.getElement(PaymentElement) as StripeCardElement;
            if (!cardElement) {
                throw new Error("Card Element not found.");
                }
            // Use your card Element with other Stripe.js APIs
            const paymentMethod = await stripe.createPaymentMethod({
                    type: "card",
                    card: cardElement,
            });
            // if payment method error throw error
            if (paymentMethod.error) {
                throw new Error(paymentMethod.error.message);
              }
            // Use the stripe.confirmCardPayment() method to submit the payment details to Stripe.
            const confirmPaymentIntent = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.paymentMethod?.id,
              });
            // if confirm payment intent error throw error
            if (confirmPaymentIntent.error) {
                throw new Error(confirmPaymentIntent.error.message);
              }
          // Payment success
            console.log("Payment Approved");
            cartStore.setCheckout("success");
        } catch (error) {
            // Handle general errors
            console.log(error);
            alert(error);
        }
        setIsLoading(false);
        console.log(handleSubmit)
    }

    return ( 
        <form className="text-gray-600" onSubmit={handleSubmit}>
            <CardElement id="card-element" options={{ style: { base: { fontSize: "16px" } } }}/>
            <h1 className="py-4 text-sm font-bold">Total: {formattedPrice}</h1>
            <button className={`py-2 mt-4 w-full bg-teal-700 rounded-md text-white disabled:opacity-25`} id="submit" disabled={isLoading || !stripe || !elements }>
                <span id="button-text">
                    {isLoading ? <span>Processing</span> : <span>Pay now</span>}
                </span>
            </button>
        </form>
     );
}
 
export default CheckoutForm;
