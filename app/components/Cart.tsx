"use client";
import Image from "next/image";
import { useCartStore } from "@/store";
import formatPrice from "@/util/PriceFormat";
import {IoAddCircleOutline, IoRemoveCircle} from "react-icons/io5";
import basket from "../../public/images/shopping-basket.png";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
    const cartStore = useCartStore();
    
    // Total Price
    const totalPrice = cartStore.cart.reduce((acc, item) => {
        return acc + item.unit_amount! * item.quantity!
    }, 0 );
    return (
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
            className="bg-white absolute right-0 top-0 w-1/4 h-screen p-12 overflow-y-scroll text-gray-700">
                <h1>Cart</h1>
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
                {/* Total Price and check logic if cart empty total price dont render */}
                {cartStore.cart.length > 0 && (
                    <p>Total: {formatPrice(totalPrice)}</p>
                )}
                {/** if cart is empty btn will not rendered */}
                <motion.div layout>
                {cartStore.cart.length > 0 && (
                   <button className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white">Checkout</button>     
                )}
                </motion.div>
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