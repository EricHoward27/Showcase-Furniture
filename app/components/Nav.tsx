"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";

// create a Nav component
const Nav = () => {
    return ( 
        <nav><h1>Hello Nav!</h1></nav>
     );
}
 
export default Nav;