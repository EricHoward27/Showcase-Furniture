import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

interface CreatePaymentIntentProps {
  name: string;
  id: string;
  image?: string;
  unit_amount: number;
  description?: string;
  quantity: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const prisma = new PrismaClient();

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
    const userSession = await getServerSession(req, res, authOptions);
    if (!userSession) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }

    const { items, payment_intent_id } = req.body;

    const orderData = {
      user: { connect: { id: userSession.user?.id } },
      amount: calculateOrderAmount(items),
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
      // ...
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
