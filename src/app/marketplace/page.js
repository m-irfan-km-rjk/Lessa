'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { IoFilter } from "react-icons/io5";
import ItemCard from "@/components/ItemCard";
import MNavbar from "@/components/MNavbar";
import { auth } from "../../../config";

export default function Marketplace() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (curuser) => {
            if (curuser) {
                setUser(curuser);
            } else {
                setUser(null);
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-bgBlue w-screen flex flex-col overflow-auto min-h-screen">
            <MNavbar color="light" user={user} search={"true"}/>

            {products?<div className="flex flex-col md:flex-row justify-center items-start gap-4 w-full h-full  bg-gray-200 p-4">
                
                {/* Filter Sidebar */}
                <div className="md:flex flex-col md:w-1/3 w-full bg-white rounded-lg shadow-md items-center p-4 hidden">
                    <p className="text-2xl font-bold capitalize">FILTERS</p>
                    <div className="flex justify-center items-center text-lg font-semibold gap-2">
                        <IoFilter /> Apply Filters Here
                    </div>
                </div>

                {/* Marketplace Items */}
                <div className="w-full bg-white rounded-lg shadow-md p-4">
                    <p className="text-2xl text-center font-bold">MARKETPLACE</p>
                    <hr className="w-full mb-2 border-black"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products &&
                            products.map(({ id, image, price, name, address, route }) => (
                                <ItemCard key={id} info={{ name, price, address, image, route }} />
                            ))}
                    </div>
                </div>
            </div>:<div className="flex justify-center items-start w-full h-screen bg-gray-200 p-4"><div className="bg-white w-full p-2 font-bold text-center rounded-lg">Loading</div></div>}
        </div>
    );
}