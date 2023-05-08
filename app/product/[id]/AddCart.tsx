"use client";
import { useCartStore } from "@/store";
import { useState, useEffect } from "react";

interface AddCartProps {
    
    name: string;
    image: string;
    unit_amount: number;
    id: string;
    quantity: number | 1 ;
 
}
// AddCart component to add items to the cart
const AddCart = ({name, image, unit_amount, id, quantity}: AddCartProps) => {
    // set the cartStore to useCartStore from the store.tsx file
    const cartStore = useCartStore();

    return(
        <>
            <button onClick={() => cartStore.addProduct({id,name,unit_amount,quantity,image})} className="my-12 text-white py-2 px-6 font-medium rounded-md bg-teal-700 ">Add to cart</button>
        </>
    )
};
export default AddCart;