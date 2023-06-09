"use client";
import Image from "next/image";
import { useCartStore } from "@/store";
import formatPrice from "@/util/PriceFormat";
import {IoAddCircleOutline, IoRemoveCircle} from "react-icons/io5";
import {IoIosCloseCircleOutline} from "react-icons/io";
import basket from "../../public/images/shopping-basket.png";
import { motion, AnimatePresence } from "framer-motion";
import Checkout from "./Checkout";
import TotalPrice from "@/util/TotalPrice";

const Cart = () => {
    const cartStore = useCartStore();
    
    // Total Price
    const totalPrice = TotalPrice();

    return (
        // Overlay
        <motion.div 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        onClick={() => cartStore.toggleCart()} 
        className="fixed w-full h-screen left-0 top-0 bg-black/25">
            {/* Cart */}
            <motion.div 
            layout
            onClick={(e) => e.stopPropagation()} 
            className="bg-white absolute right-0 top-0  h-screen p-12 overflow-y-scroll text-gray-700 w-full lg:w-2/5">
                <h1>Cart</h1>
                {/* Close btn */}
                {cartStore.onCheckout === "cart" && (
                    <button 
                    onClick={() => cartStore.toggleCart()} 
                    className="absolute right-0 top-0 mt-4 mr-4"><IoIosCloseCircleOutline className="text-2xl" />
                        Back to Store
                    </button>
                )}
                {cartStore.onCheckout === "checkout" && (
                    <button 
                    onClick={() => cartStore.setCheckout("cart")} 
                    className="absolute right-0 top-0 mt-4 mr-4"><IoIosCloseCircleOutline className="text-2xl" />
                        Back to Cart
                    </button>
                )}
             
                {/**Cart Items */}
                {cartStore.onCheckout === "cart" && (
                 <>
                {/* Map through cart and render products */}
                {cartStore.cart.map((item) => (
                    <motion.div 
                    layout
                    key={item.id} 
                    className="flex py-4 gap-4">
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
                    </motion.div>
                ))}
                </>
                )}
                {/* Total Price and check logic if cart empty total price dont render */}
                {cartStore.cart.length > 0 && cartStore.onCheckout === "cart" ?  (
                <motion.div layout>
                <p>Total: {formatPrice(totalPrice)}</p>
                {/** if cart is empty btn will not rendered */}
                <button 
                   onClick={() => cartStore.setCheckout("checkout") }
                   className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white">
                    Checkout
                </button>
                </motion.div>
                ) : null}
                
                 {/* Checkout Form*/}
                 {cartStore.onCheckout === "checkout" && <Checkout />}
                {/* if cart is empty show this; add animation for page when cart empty */}
                <AnimatePresence>
                {!cartStore.cart.length && (
                    <motion.div 
                    animate={{scale: 1, rotateZ: 0, opacity: 0.75}}
                    initial={{scale: 0.5, rotateZ: -10, opacity: 0}}
                    exit={{scale: 0.5, rotateZ: -10, opacity: 0}}
                    className="flex flex-col items-center gap-12 text 2xl font-medium pt-56 opacity-75">
                        <h1>Your cart is currently empty </h1>
                        <Image src={basket} alt="basket" width={200} height={200} />
                    </motion.div>
                )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}
export default Cart;