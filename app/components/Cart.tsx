"use client";
import Image from "next/image";
import { useCartStore } from "@/store";
import formatPrice from "@/util/PriceFormat";
import {IoAddCircleOutline, IoRemoveCircle} from "react-icons/io5";
import basket from "../../public/images/shopping-basket.png";

const Cart = () => {
    const cartStore = useCartStore();
    console.log(cartStore.cart)
    return (
        <div onClick={() => cartStore.toggleCart()} className="fixed w-full h-screen left-0 top-0 bg-black/25">
            <div onClick={(e) => e.stopPropagation()} className="bg-white absolute right-0 top-0 w-1/4 h-screen p-12 overflow-y-scroll text-gray-700">
                <h1>Shopping Cart Test</h1>
                {cartStore.cart.map((item) => (
                    <div key={item.id} className="flex py-4 gap-4">
                        <Image className="rounded h-24" src={item.image ?? ""} alt={item.name} width={120} height={120} />
                        <div>
                            <h2>{item.name}</h2>
                            {/* update quanity of a product*/}
                            <div className="flex gap-2">
                            <h2>Quantity:{item.quantity}</h2>
                            {/* btn click func remove product from cart */}
                            <button onClick={() => cartStore.removeProduct({
                                id: item.id,
                                name: item.name,
                                image: item.image,
                                unit_amount: item.unit_amount,
                                quantity: item.quantity -1
                            })}><IoRemoveCircle  /></button>
                            {/* btn click func add product to cart */}
                            <button onClick={() => cartStore.addProduct({
                                id: item.id,
                                name: item.name,
                                image: item.image,
                                unit_amount: item.unit_amount,
                                quantity: item.quantity + 1
                            })}><IoAddCircleOutline /></button>
                            </div>
                            <p className="text-sm">{formatPrice(item.unit_amount)}</p>
                           
                        </div>
                    </div>
                ))}
                {/** if cart is empty btn will not rendered */}
                {cartStore.cart.length > 0 && (
                   <button className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white">Checkout</button>     
                )}
                {!cartStore.cart.length && (
                    <div className="flex flex-col items-center gap-12 text 2xl font-medium pt-56 opacity-75">
                        <h1>Your cart is currently empty </h1>
                        <Image src={basket} alt="basket" width={200} height={200} />
                    </div>
                )}
            </div>
        </div>
    )
}
export default Cart;