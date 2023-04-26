import './globals.css';
import { Inter } from 'next/font/google';
import Nav from './components/Nav';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Showcase Furniture',
  description: 'Rent to Own Furniture',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        {children}
      
      </body>
    </html>
  )
}
