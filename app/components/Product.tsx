import Image from 'next/image';
import formatPrice from "@/util/PriceFormat";
import Link from 'next/link';

interface ProductProps {
    id: string,
    name: string;
    unit_amount: number;
    image?: string;
    description: string | null;
    metadata: {
        features: string;
    }
}

export default function Product({name, unit_amount, image, description, metadata, id}: ProductProps) {
  const { features } = metadata;
  return (
    // Link to product page using the product id
    <Link href={{pathname: `/product/${id}`, query: {name, image, unit_amount, id, description, features}}}>
    <div className='text-gray-700'>
        <Image src={image} alt={name} width={800} height={800} className='w-full h-80 object-fill rounded-lg' />
        <div className='font-medium py-2'>
          <h1>{name}</h1>
      <h2 className='text-sm text-teal-700'>{unit_amount !== null ? formatPrice(unit_amount): "N/A"}</h2>
        </div>
      
    </div>
    </Link>
  )
}