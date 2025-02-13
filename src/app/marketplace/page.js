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
    const [products, setProducts] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/products');
            const data = await response.json();
            console.log(data);
            setProducts(data.products);
            } catch (error) {
                console.error(error);
            }
    };

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
        fetchProducts();

        console.log(products);

        return () => unsubscribe();
    },[]);

    if(!products) {
        return(
            <div className="text-xl">
                Loading
            </div>
        );
    } else {
        return(
            <div className="flex flex-col h-screen bg-bgBlue">
                <MNavbar user={user} color={"light"} search={"true"}/>
                <div className="flex w-[100%] bg-white md:p-2 gap-1 justify-center items-center">
                    <div className=" border-black border-[1px] w-[20%] h-[100%] justify-center items-center hidden md:block">
                        
                    </div>
                    <div className="border-black border-[1px] md:w-[80%] h-auto grid-cols-1 p-1">
                        {products &&
                            products.map(({ id, image, price, name, address, route }) => (
                                <div key={id} className="h-full">
                                    <ItemCard info={{ name, price, address, image, route }} />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Marketplace;