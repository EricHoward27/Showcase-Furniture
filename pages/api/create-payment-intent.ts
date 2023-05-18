import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

interface CreatePaymentIntentProps {
    id: string,
    name: string;
    unit_amount: number | null;
    image?: string;
    description: string | null;
    quantity: number | 1;
    metadata: {
        features: string;
    }
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
  });
// Calculate the order total on the server
  const calculateOrderAmount = (items: CreatePaymentIntentProps[]) => {
    const totalPrice = items.reduce((acc, item) => {
        return acc + item.unit_amount! * item.quantity!
    }, 0)
    return totalPrice
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get the User
    const userSession = await getServerSession(req, res, authOptions)
    if (!userSession) {
        res.status(403).json({ error: "Not logged in" });
        return;
    }
    // Extract the body
    const { items, payment_intent_id } = req.body;
    
    // Create the order data
    const orderData = {
        user: { connect: { id: userSession.user?.id } },
        amount: calculateOrderAmount(items),
        currency: "usd",
        status: "pending",
        paymentIntendID: payment_intent_id,
        products: {
            create: items.map((item: { name: string; description: string; image: string; quantity: number | 1; unit_amount: number | null; }) => ({
                name: item.name,
                description: item.description,
                image: item.image,
                quantity: item.quantity,
                price: item.unit_amount,
                
            }))
        }
    }
    res.status(200).json({ userSession })
    return

}