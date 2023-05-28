import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  name: string;
  id: string;
  image?: string;
  unit_amount: number;
  quantity: number;
  description?: string;
};

type CartState = {
  isOpen: boolean;
  cart: CartItem[];
  toggleCart: () => void;
  addProduct: (item: CartItem) => void;
  removeProduct: (item: CartItem) => void;
  paymentIntent: string;
  onCheckout: string;
  setPaymentIntent: (val: string) => void;
  setCheckout: (val: string) => void;
};

export const useCartStore = create<CartState>()(
    // set is a function that takes a partial state and merges it into the current state
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      paymentIntent: "",
      onCheckout: 'cart',
      toggleCart: () => {
        try {
          set((state) => ({ isOpen: !state.isOpen }));
        } catch (error) {
          console.error("An error occurred while toggling the cart:", error);
            alert('An error occurred while toggling the cart:' + error)
        }
      },
      // add a product to the cart
      addProduct: (item) => {
        try {
          set((state) => {
            const existingItem = state.cart.find(
              (cartItem) => cartItem.id === item.id
            );
            if (existingItem) {
              const updatedCart = state.cart.map((cartItem) => {
                if (cartItem.id === item.id) {
                  return {
                    ...cartItem,
                    quantity: cartItem.quantity! + 1,
                  };
                }
                return cartItem;
              });
              return { cart: updatedCart };
            } else {
              return { cart: [...state.cart, { ...item, quantity: 1 }] };
            }
          });
        } catch (error) {
          console.error("An error occurred while adding the product:", error);
            alert('An error occurred while adding the product:' + error)
        }
      },
      // remove a product from the cart
      removeProduct: (item) => {
        try {
          set((state) => {
            const existingItem = state.cart.find(
              (cartItem) => cartItem.id === item.id
            );
            if (existingItem && existingItem.quantity! > 1) {
              const updatedCart = state.cart.map((cartItem) => {
                if (cartItem.id === item.id) {
                  return {
                    ...cartItem,
                    quantity: cartItem.quantity! - 1,
                  };
                }
                return cartItem;
              });
              return { cart: updatedCart };
            } else {
              const filteredCart = state.cart.filter(
                (cartItem) => cartItem.id !== item.id
              );
              return { cart: filteredCart };
            }
          });
        } catch (error) {
          console.error("An error occurred while removing the product:", error);
          alert('An error occurred while removing the product:' + error)
        }
      },
      setPaymentIntent: (val) => {
        try {
          set((state) => ({ paymentIntent: val }));
        } catch (error) {
          console.error("An error occurred while setting the payment intent:", error);
          alert('An error occurred while setting the payment intent:' + error)
        }
      },
      setCheckout: (val) => {
        try {
          set((state) => ({ onCheckout: val }));
        } catch (error) {
          console.error("An error occurred while setting the checkout:", error);
          alert('An error occurred while setting the checkout:' + error);
        }
      },
    }),
    { name: "cart-store" }
  )
);
