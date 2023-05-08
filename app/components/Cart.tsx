"use client";
import Image from "next/image";
import { useCartStore } from "@/store";

const Cart = () => {
    const cartStore = useCartStore();
    console.log(cartStore.cart)
    return (
        <div>
            <h1>Cart</h1>
        </div>
    )
}
export default Cart;