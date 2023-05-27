import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "@/util/prisma";

interface CreatePaymentIntentProps {
  name: string;
  image?: string;
  unit_amount: number;
  description?: string;
  quantity: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

// Calculate the order total on the server
const calculateOrderAmount = (items: CreatePaymentIntentProps[]) => {
  if (!Array.isArray(items)) {
    throw new Error("Invalid argument: items must be an array");
  }
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);
  return totalPrice;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the User's session
    const userSession = await getServerSession(req, res, authOptions);
    if (!userSession?.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    // Extract the data we need from the request body
    const { items, payment_intent_id } = req.body;
    const total = calculateOrderAmount(items);
    
    // Create the order data
    const orderData = {
      user: { connect: { id: userSession.user?.id } },
      amount: total,
      currency: "usd",
      status: "pending",
      paymentIntentId: payment_intent_id,
      products: {
        create: items.map((item: CreatePaymentIntentProps) => ({
          name: item.name,
          description: item.description || null,
          image: item.image,
          quantity: item.quantity,
          unit_amount: parseFloat(item.unit_amount!.toString()),
        })),
      },
    };

    if (payment_intent_id) {
      // Code for updating order with existing payment intent
      // check if payment intent exists just update the order
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      )
      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          { amount: total }
        )
      }
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      orderData.paymentIntentId = paymentIntent.id;
      const newOrder = await prisma.order.create({
        data: orderData,
        include: { products: true }, // Include the associated products in the response
      });

      res.status(200).json({ paymentIntent });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.message === "Invalid argument: items must be an array") {
        res.status(400).json({
          error: "Bad Request: items should be an array.",
        });
      } else {
        res.status(500).json({
          error: "Internal Server Error: Something went wrong on the server.",
        });
      }
    } else {
      res.status(500).json({
        error: "Internal Server Error: Unexpected error occurred.",
      });
    }
  }
}
