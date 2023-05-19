import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

interface CreatePaymentIntentProps {
    name: string,
    id: string,
    image?: string,
    unit_amount: number,
    description?: string,
    quantity: number,
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
  });
  const prisma = new PrismaClient();
  
// Calculate the order total on the server
  const calculateOrderAmount = (items:CreatePaymentIntentProps[]) => {
    // throw error if items is empty
    if(!Array.isArray(items)) {
        throw new Error("Invalid argument: items must be an array ")
    }
    const totalPrice = items.reduce((acc, item) => {
        return acc + (item.unit_amount ?? 0) * (item.quantity ?? 0)
    }, 0)
    return totalPrice
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
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
        paymentIntendId: payment_intent_id,
        products: {
            create: items.map((item: { name: string; description: string; image: string; quantity: number | 1; unit_amount: number | null; }) => ({
                name: item.name,
                description: item.description,
                image: item.image,
                quantity: item.quantity,
                unit_amount: item.unit_amount,
                
            })),
        },
    }

    // Check if the payment intent exists to update the order with current items
    if(payment_intent_id) {
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id)
        if(current_intent) {
            const updated_intent = await stripe.paymentIntents.update(payment_intent_id, 
                { amount: calculateOrderAmount(items) }
            )
            // fetch order with product product ids
            const existing_order = await prisma.order.findFirst({
                where: {paymentIntentId: updated_intent.id},
                include: {products: true}
            })
            if(!existing_order) {
                res.status(400).json({error: "Invalid Payment Intent"})
            }
            // Update Existing Order
            const updated_order = await prisma.order.update({
                where: {id: existing_order?.id},
                data: {
                    amount: calculateOrderAmount(items),
                    products: {
                        deleteMany: {},
                        create: items.map((item : CreatePaymentIntentProps) => ({
                            name: item.name,
                            description: item.description,
                            image: item.image,
                            quantity: item.quantity,
                            unit_amount: item.unit_amount,
                        }))
                    }
                }
            })
            res.status(200).json({ paymentIntent: updated_intent })
            return
        }

    } else {
        // Create a new order with prisma
        const paymenIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        })
        // Add the payment intent id to the order
        orderData.paymentIntendId = paymenIntent.id
        // Create the order
        const newOrder = await prisma.order.create({
            data: orderData,
        })
    }
    res.status(200).json({ payment_intent_id })
    return

    } catch(error) {
        console.error(error); // log the error so we can see it in the console
        if (error instanceof Error) {
            if( error.message === "Invalid argument: items must be an array ") {
                res.status(400).json({
                    error: "Bad Request: items should be an array."
                });
            } else {
                res.status(500).json({
                    error: "Internal Server Error: Something went wrong on the server."
                });
            }
        } else {
            // handle non-error throws
            res.status(500).json({
                error: "Internal Server Error: Unexpected error occurred."
            });
        }
    }

}