import Image from 'next/image';
import formatPrice from "@/util/PriceFormat";

interface ProductProps {
    name: string;
    price: number | null;
    image: string;
}

export default function Product({name, price, image}: ProductProps) {
  return (
    <div>
        <Image src={image} alt={name} width={400} height={400} />
      <h1>{name}</h1>
      <h1>{price !== null ? formatPrice(price): "N/A"}</h1>
    </div>
  )
}