"use client";

import MNavbar from "@/components/MNavbar";
import Image from "next/image";
import Link from "next/link";
import { auth } from "../../config";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
        } else {
            router.push("/login");
        }
    });

    return () => unsubscribe();
}, []);

  return (
    <div className="w-full justify-center items-center bg-bgBlue">
      <MNavbar user={auth.currentUser} color={"light"}/>
      <div className="flex flex-col md:flex-row justify-between items-center md:p-10">
        <div className="p-4">
          <p className="text-white font-bold font-serif py-3 md:py-2 md:text-5xl text-3xl text-center md:text-left">Discover Endless Possiblilities</p>
          <p className="text-white text-center md:text-left md:my-5 my-7">Unlock a world of endless Possibilities</p>
          <div className="md:justify-normal md:gap-5 flex justify-between py-4">
            <button className="rounded-lg p-2 px-4 bg-white hover:bg-gray-200 text-gray-500">Rent Now</button>
            <Link href={"/marketplace"}><button className="rounded-lg p-2 px-4 bg-blue-600 hover:bg-blue-800 text-white">Go to Marketplace</button></Link>
          </div>
          
        </div>
        <Image className="md:w-[600px] overflow-hidden rounded-lg" src={"/clip_art.png"} width={400} height={400}/>
      </div>
      <div className="flex md:flex-row flex-col justify-between gap-2 items-center w-full bg-white p-4">
        <Image className="rounded-lg" src={"/clip_art_furniture.jpg"} width={500} height={500}/>
        <div className="w-[100%] md:h-[500px] border-black  border-2 rounded-lg p-3 justify-center items-center">
          <p className="text-3xl text-left font-bold py-4">Discover the Convinence</p>
          <p className="text-sm py-3">Revolutionize your lifestyle: rent anything, anytime. Our user-to-user platform gives you instant access to a wide range of items, from tools to luxury goods. Quick, easy, and affordable—no long-term commitments. Connect with local users and rent what you need, when you need it.</p>
          <Link className="text-blue-600" href="#">Explore Now</Link>
          <p className="text-3xl text-left font-bold py-4">Rent Anything</p>
          <p className="text-sm py-3">Unlock a world of possibilities with our user-to-user platform. Rent what you need, when you need it—quick, flexible, and hassle-free. From everyday items to luxury goods, enjoy easy access without the commitment of ownership.</p>
          <Link className="text-blue-600" href="#">Join Us</Link>
          <p className="text-3xl text-left font-bold py-4">How it Works</p>
          <p className="text-sm py-3">Our platform makes renting easy. Browse items from trusted users, set rental terms that fit your needs, and book securely. Use the item, then return it when you're done—quick, simple, and hassle-free.</p>
          <Link className="text-blue-600" href="#">Learn More</Link>
        </div>
      </div>
    </div>
  );
}
