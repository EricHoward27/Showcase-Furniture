"use client";
import Link from "next/link";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import showcaseLogo from "../../public/images/showcase_logo.png";
import Cart from "./Cart";
import { useCartStore } from "@/store";
import {CgShoppingCart} from "react-icons/cg";
import {motion, AnimatePresence} from "framer-motion";

// create a Nav component
const Nav = ({ user }: Session) => {
    const cartStore = useCartStore();
    return ( 
        <nav className="flex justify-between items-center py-7">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-6">
                    {/* Image logo */}
                    <Link href="/">
                    <Image src={showcaseLogo} alt="Logo" width={200} height={50} />
                    </Link>
                    <ul className="flex items-center space-x-6">
                    { /*cart icon & toggle the cart */}
                    <li onClick={() => cartStore.toggleCart()} className=" flex items-center text-3xl relative cursor-pointer">
                        <CgShoppingCart />
                        {/* if cart is empty, hide the number */}
                        <AnimatePresence>
                        {cartStore.cart.length > 0 && (
                        <motion.span 
                            animate={{scale: 1}} 
                            initial={{scale: 0}} 
                            exit={{scale: 0}}
                            className="bg-teal-700 text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center ">
                            {cartStore.cart.length}
                        </motion.span>
                        )}
                        </AnimatePresence>
                    </li>
                    {/* if user is not log in */} 
                    {!user && (
                    <li>
                        <button onClick={() => signIn()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800">
                            Sign In
                        </button>
                    </li>
                    )}
                    {/* if user is log in */}
                    {user && (
                    <li>
                        {/* user profile image; when click drop down for sign out */}
                        <Image src={user?.image as string} 
                        alt={user.name as string} 
                        width={36}
                        height={36}
                        className={"rounded-full"}
                        />
                    </li>
                    )}
                </ul>
                </div>
            </div>
            <AnimatePresence>
                {cartStore.isOpen && <Cart />}          
            </AnimatePresence>
        </nav>
     );
}
 
export default Nav;