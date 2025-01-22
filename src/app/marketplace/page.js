'use client';

import ItemCard from "@/components/ItemCard";
import MNavbar from "@/components/MNavbar";
import { auth } from "../../../config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

function Marketplace() {

    const [user,setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (curuser) => {
            if(curuser) {
                setUser(curuser);
                console.log(user);
            } else {
                setUser(null);
                router.push("/login");
            }
        });

        return () => unsubscribe();
    },[]);

    

    return(
        <div className="flex flex-col h-screen bg-bgBlue">
            <MNavbar user={user} color={"light"} search={"true"}/>
            <div className="flex w-[100%] bg-white md:p-2 gap-1 justify-center items-center">
                <div className=" border-black border-[1px] w-[20%] h-[100%] justify-center items-center hidden md:block">
                    
                </div>
                <div className=" border-black border-[1px] md:w-[80%] h-auto p-1 space-y-1">
                    <ItemCard info={{name:"Boost Mobile | Apple iPhone 16 Pro (512 GB) - Desert Titanium [Locked]. Apple Intelligence.", price:"100.00", address:"123 Baker Street Springfield, IL 62704 United States", image:"/clip_art_furniture.jpg"}}/>
                    <ItemCard info={{name: "Samsung Galaxy S23 Ultra (1 TB) - Phantom Black [Unlocked]", price: "1,199.99", address: "456 Elm Street, Apt 5, Los Angeles, CA 90001, United States", image: "/clip_art_furniture.jpg"}} />
                    <ItemCard info={{name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones", price: "349.99", address: "789 Maple Avenue, Suite 10, San Francisco, CA 94105, United States", image: "/clip_art_furniture.jpg"}} />
                    <ItemCard info={{name: "Dell XPS 15 Laptop (16 GB RAM, 512 GB SSD)", price: "1,499.99", address: "1010 Birch Street, Denver, CO 80202, United States", image: "/clip_art_furniture.jpg"}} />
                    <ItemCard info={{name: "Dell XPS 15 Laptop (16 GB RAM, 512 GB SSD)", price: "1,499.99", address: "1010 Birch Street, Denver, CO 80202, United States", image: "/clip_art_furniture.jpg"}} />
                </div>
            </div>
        </div>
    );
}

export default Marketplace;