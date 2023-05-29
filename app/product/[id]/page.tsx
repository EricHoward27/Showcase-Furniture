import Image from "next/image";
import formatPrice from "@/util/PriceFormat";
import AddCart from "./AddCart";
// interface for product page props (params and searchParams) data retrieval from the query string
interface ProductPageProps {
    params: {
        id: string;
    },
    searchParams: {
        id: string;
        name: string;
        image: string;
        unit_amount: number;
        description: string ;
        features: string;
        quantity: number | 1;
    }
}

export default async function Product({ searchParams }: ProductPageProps) {
    return(
        <div className="flex flex-col lg:flex-row items-center justify-between gap-24 text-gray-700">
            <Image src={searchParams.image} alt={searchParams.name} width={800} height={800} className='w-80 h-80 object-fill rounded-lg' priority={true} />
        <div className="font-medium text-gray-700">
            <h1 className="text-2xl font-medium py-2">{searchParams.name}</h1>
            <p className="py-2">{searchParams.description}</p>
            <p className="py-2">{searchParams.features}</p>
        <div className="flex gap-2">
            <p className="font-bold text-teal-700 ">{searchParams.unit_amount && formatPrice(searchParams.unit_amount)}</p>
        </div>
        <AddCart {...searchParams} />
        </div>
    </div>

    )

}