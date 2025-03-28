'use client';

import { auth } from "../../../config";
import { useEffect, useState } from "react";
import { LiaBoxSolid, LiaPenSolid, LiaRupeeSignSolid, LiaTagSolid } from "react-icons/lia";
import { MdEdit } from "react-icons/md";
import Image from "next/image";
import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import MNavbar from "@/components/MNavbar";
import { FaLaptop, FaCouch, FaDumbbell, FaBook, FaCar, FaPuzzlePiece, FaPaw, FaIndustry } from "react-icons/fa";
import ItemCard from "@/components/ItemCard";

export default function Profile() {
    const [user,setUser] = useState(null);
    const [userdata, setUserData] = useState(null);

    const fetchUserData = async (uid) => {
        const response = await fetch("/api/user?uuid="+uid);
        const data = await response.json();
        setUserData(data);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                fetchUserData(user.uid);
                console.log(user);
            } else {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, []);

    return(
        <div className="bg-bgBlue w-screen full flex flex-col space-y-2 overflow-auto">
            <MNavbar color={"light"} user={user} />

            {(userdata)?<div className="flex flex-col md:flex-row justify-center items-start gap-4 w-full h-full mt-4 bg-gray-200 p-4">

                <div className="flex flex-col md:w-1/3 w-full bg-white h-full justify-center rounded-lg shadow-md items-center gap-2 p-4">
                    <p className="text-2xl font-bold capitalize">PROFILE INFO</p>
                    <hr className="w-full mb-2 border-black"/>
                    {user && (
                        <div className="flex flex-col items-center gap-4">
                            <Image
                                className="rounded-full p-1 border border-gray-400"
                                src={user.photoURL}
                                alt="Profile pic"
                                width={150}
                                height={150}
                            />
                            <p className="text-lg font-bold">{user.displayName}</p>
                            {userdata && <p className="text-lg font-bold">{userdata.address}</p>}
                        </div>
                    )}
                    <button className="w-full p-2 bg-blue-600 hover:bg-blue-400 text-white font-bold rounded-lg flex justify-center gap-1"><MdEdit className="text-xl"/>Edit Profile</button>
                </div>

                <div className="flex flex-col gap-2 w-full bg-white rounded-lg shadow-md p-4">
                    <p className="text-2xl text-center font-bold">YOUR RENTALS</p>
                    <hr className="w-full mb-2 border-black"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userdata && userdata.productData.map(({ id, image, price, name, address, route }) => (
                            <ItemCard key={id} info={{ name, price, address, image, route }} />
                        ))}
                    </div>
                </div>
            </div>:<div className="bg-white text-center font-bold text-2xl">Loading</div>}
        </div>
    );
}