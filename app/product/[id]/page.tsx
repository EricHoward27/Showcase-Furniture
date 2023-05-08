import Image from "next/image";
import formatPrice from "@/util/PriceFormat";
// interface for product page props (params and searchParams) data retrieval from the query string
interface ProductPageProps {
    params: {
        id: string;
    },
    searchParams: {
        name: string;
        image: string;
        unit_amount: number | null;
        description: string | null;
        features: string;
    }
}

export default async function Product({ searchParams }: ProductPageProps) {
    return(
        <div className="flex justify-between gap-24 p-12 text-gray-700">
            <Image src={searchParams.image} alt={searchParams.name} width={800} height={800} className='w-80 h-80 object-fill rounded-lg' />
        <div className="font-medium text-gray-700">
            <h1 className="text-2xl font-medium py-2">{searchParams.name}</h1>
            <p className="py-2">{searchParams.description}</p>
            <p className="py-2">{searchParams.features}</p>
        <div className="flex gap-2">
            <p className="font-bold text-teal-700 ">{searchParams.unit_amount && formatPrice(searchParams.unit_amount)}</p>
        </div>
        <button className="my-12 text-white py-2 px-6 font-medium rounded-md bg-teal-700">Add to cart</button>
        </div>
    </div>

    )

}