"use client"
import { ReactNode, useEffect, useState } from "react";


const Hydrate = ({ children }: { children: ReactNode }) => {
    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);
    if (!isHydrated) {
        return <div>Loading...</div>;
    }
    return <>{children}</>;
};
export default Hydrate;