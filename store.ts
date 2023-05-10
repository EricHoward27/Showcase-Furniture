import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
    name: string,
    id: string,
    image?: string,
    unit_amount: number,
    quantity: number,
}
type CartState = {
    isOpen: boolean;
    cart: CartItem[];
    toggleCart: () => void;
    addProduct: (item:CartItem) => void;
    removeProduct: (item:CartItem) => void;
}
export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: [],
            isOpen: false,
        // toggle cart function that will set state to the opposite of what it is for isOpen
        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        //add product function that will add the item to the cart
        addProduct: (item) => set((state) => {
            //check if item is already in cart
            const existingItem = state.cart.find(cartItem => cartItem.id === item.id);
            //if item is not in cart, add it
            if(existingItem) {
                const updatedCart = state.cart.map((cartItem) => {
                    //if item is in cart, update the quantity
                    if (cartItem.id === item.id) {
                        return {
                            ...cartItem,
                            quantity: cartItem.quantity! + 1,
                        };
                    }
                    //if item is not in cart, return the cartItem
                    return cartItem;
                })
                // return the updated cart
                return { cart: updatedCart };
            } else {
                return { cart: [...state.cart, {...item, quantity: 1}] };
            }
        }),
        //remove product function that will remove the item from the cart
        removeProduct: (item) => set((state) => {
            //check if item is already in cart
            const existingItem = state.cart.find(cartItem => cartItem.id === item.id);
            if(existingItem && existingItem.quantity! > 1){
                //decrement quantity
                const updatedCart = state.cart.map((cartItem) => {
                    if(cartItem.id === item.id){
                        return {
                            ...cartItem,
                            quantity: cartItem.quantity! - 1,
                        }
                    }
                    return cartItem;
                })
                return { cart: updatedCart };
            } else {
                //Remove item from cart
                const filteredCart = state.cart.filter((cartItem) => cartItem.id !== item.id);
                return { cart: filteredCart };
            }
        })
        }),
        { name: "cart-store"}

    ));

