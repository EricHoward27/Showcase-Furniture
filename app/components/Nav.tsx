"use client";
import Link from "next/link";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import showcaseLogo from "../../public/images/showcase_logo.png";

// create a Nav component
const Nav = ({ user }: Session) => {
    return ( 
        <nav className="flex justify-between items-center py-7">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-6">
                    {/* Image logo */}
                    <Link href="/">
                    <Image src={showcaseLogo} alt="Logo" width={200} height={50} />
                    </Link>
                    <ul className="flex items-center space-x-6">
                    {/* if user is not log in */} 
                    {!user && (
                    <li>
                        <button onClick={() => signIn()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800">
                            Sign In
                        </button>
                    </li>
                    )}
                    {/* if user is log in */}
                    {user && (
                    <li>
                        {/* user profile image; when click drop down for sign out */}
                        <Image src={user?.image as string} 
                        alt={user.name as string} 
                        width={48}
                        height={48}
                        className={"rounded-full"}
                        />
                    </li>
                    )}
                </ul>
                </div>
            </div>
        </nav>
     );
}
 
export default Nav;