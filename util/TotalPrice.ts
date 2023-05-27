import { useCartStore } from "@/store";

const TotalPrice = () => {
const cartStore = useCartStore();
return cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
}, 0)
}
 
export default TotalPrice;