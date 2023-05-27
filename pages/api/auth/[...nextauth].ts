import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Stripe from "stripe";
import { NextAuthOptions } from "next-auth";
import { prisma } from '../../../util/prisma'


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  //create a event to update database with stripe customer id after a user is created
  events: {
    createUser: async ({user}) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2022-11-15",
      });
      //Lets create a customer in stripe
      if(user.name && user.email) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.name || undefined,
      });
   
      //update the user in the database with the stripeId
      await prisma.user.update({
        where: {id: user.id},
        data: {stripeCustomerId: customer.id},
      });
    }
  },
},
//create a session to store the user id
callbacks: {
  async session({ session, token, user }) {
    session.user = user;
    return session;
  }
}
};

export default NextAuth(authOptions);