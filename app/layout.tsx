import './globals.css';
import { Inter } from 'next/font/google';
import Nav from './components/Nav';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import  Hydrate  from './components/Hydrate';
import { Roboto } from 'next/font/google';
import { Montserrat_Alternates } from 'next/font/google';

// define main font
const roboto = Roboto({
  weight: [ "400", "500", "700"],
  subsets: ['latin'],
  variable: "--font-robot",
})
const montserrat = Montserrat_Alternates({
  weight: [ "700"],
  subsets: ['latin'],
  variable: "--font-montserrat",
})
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
  // fetch the user
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={`bg-gray-100 text-gray-800 min-h-screen mx-4 lg:mx-48 ${roboto.className}`}>
        <Hydrate>
          {session ? (
            <Nav user={session.user} expires={session.expires as string}/>
          ): (
            // Render a loading state or alternative content
            <div className="flex justify-between items-center py-4">Loading...</div>
          )}
        <div className='container mx-auto px-4 py-6'>
          {children}
        </div>
        </Hydrate>
      </body>
    </html>
  )
}
