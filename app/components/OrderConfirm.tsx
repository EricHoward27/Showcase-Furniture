"use client"
import { motion } from "framer-motion";

const OrderConfirm = () => {

    return (
        <motion.div 
        initial={{scale:0.5, opacity: 0}} 
        animate={{scale: 1, opacity: 1}}>
            <div>
                <h1>Order Confirmed</h1>
                <h2>Check your email for the receipt.</h2>
            </div>
        </motion.div>
    )
}
 
export default OrderConfirm;