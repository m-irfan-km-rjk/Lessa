"use client";

import { motion } from "framer-motion";
import { MFooter } from "@/components/MFooter";
import MNavbar from "@/components/MNavbar";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { IoArrowDown } from "react-icons/io5";
import { AuthContext } from "@/components/context/AuthProvider";

export default function Home() {
  const { user } = useContext(AuthContext);

  // Example categories (replace icons/images with your own)
  const categories = [
    { name: "Electronics", image: "/categories/electronics.png", link: "/categories/electronics" },
    { name: "Clothes", image: "/categories/clothes.png", link: "/categories/fashion" },
    { name: "Home & Living", image: "/categories/home.png", link: "/categories/home" },
    { name: "Sports", image: "/categories/sports.png", link: "/categories/sports" },
    { name: "Books", image: "/categories/books.png", link: "/categories/books" },
    { name: "Tools", image: "/categories/tools.png", link: "/categories/tools" },
    { name: "Vehicles", image: "/categories/vehicles.png", link: "/categories/vehicles" },
    { name: "Event & Party Supplies", image: "/categories/events.png", link: "/categories/events-party-stuff" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <MNavbar user={user} color="light" search={true} />

      {/* Hero Section */}
      <div className="relative min-h-screen bg-[url('/home_bg1.png')] bg-cover bg-center flex items-center justify-center">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

        {/* Content */}
        <div className="relative text-center px-6 md:px-16 py-12 rounded-xl max-w-3xl h-full animate-fadeIn">
          <h1 className="font-serif text-white text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
            LESSA
          </h1>
          <h4 className="text-white text-xl md:text-2xl font-bold mb-6 drop-shadow">
            Discover and Rent Your Favorite Items
          </h4>
          <button className="mt-4 border-white border-2 px-8 py-4 hover:bg-white hover:text-black text-white font-bold rounded-lg shadow-xl transform transition hover:scale-105">
            Shop Now
          </button>
        </div>

        {/* Scroll down arrow - fixed at bottom */}
        {/* Scroll down arrow - fixed at bottom */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => {
              document.getElementById("featured")?.scrollIntoView({
                behavior: "smooth"
              });
            }}
          >
            <IoArrowDown className="text-white text-4xl animate-bounce cursor-pointer" />
          </button>
        </div>


        {/* Animation */}
        <style jsx>{`
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 1s ease-out forwards;
    }
  `}</style>
      </div>


      {/* Scrolling Highlights */}
      <div className="overflow-hidden bg-black">
        <div className="whitespace-nowrap animate-marquee py-3">
          <span className="mx-8 font-bold text-white">🔥 Free delivery on rentals over Rs.500!</span>
          <span className="mx-8 font-bold text-white">✨ Rent electronics, clothes & more today!</span>
          <span className="mx-8 font-bold text-white">💡 Discover new items every week!</span>
          <span className="mx-8 font-bold text-white">🎉 Special discounts on seasonal items!</span>
          <span className="mx-8 font-bold text-white">📦 Easy doorstep delivery & returns!</span>
          <span className="mx-8 font-bold text-white">🛠️ Tools available for rent at amazing rates!</span>
          <span className="mx-8 font-bold text-white">🚗 Rent vehicles for short trips hassle-free!</span>
          <span className="mx-8 font-bold text-white">🎁 Party supplies delivered on time!</span>

          {/* Duplicate content for seamless scroll */}
          <span className="mx-8 font-bold text-white">🔥 Free delivery on rentals over Rs.500!</span>
          <span className="mx-8 font-bold text-white">✨ Rent electronics, clothes & more today!</span>
          <span className="mx-8 font-bold text-white">💡 Discover new items every week!</span>
          <span className="mx-8 font-bold text-white">🎉 Special discounts on seasonal items!</span>
          <span className="mx-8 font-bold text-white">📦 Easy doorstep delivery & returns!</span>
          <span className="mx-8 font-bold text-white">🛠️ Tools available for rent at amazing rates!</span>
          <span className="mx-8 font-bold text-white">🚗 Rent vehicles for short trips hassle-free!</span>
          <span className="mx-8 font-bold text-white">🎁 Party supplies delivered on time!</span>
        </div>

        <style jsx>{`
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      display: inline-block;
      animation: marquee 20s linear infinite;
    }
  `}</style>
      </div>


      {/* Featured Categories */}
      <motion.div
        id="featured"
        className="py-10 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Featured Categories</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 mb-10">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              className="relative group overflow-hidden rounded-xl shadow-lg transform transition hover:scale-125"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href={cat.link}>
                <div className="absolute inset-0 hover:scale-110">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition"></div>
                </div>
                <div className="relative p-6 flex flex-col items-center justify-center h-40 text-center text-white font-bold text-lg">
                  {cat.name}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>


      {/* How Lessa Works */}
      <motion.div
        className="bg-blue-900 py-20 text-center font-sans"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-white tracking-tight">
          How Lessa Works
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
          {[
            { icon: "🛒", title: "Browse Items", desc: "Explore thousands of items available for rent across multiple categories.", bg: "bg-blue-500" },
            { icon: "📦", title: "Select & Rent", desc: "Choose your item, select rental duration, and place your order easily.", bg: "bg-green-500" },
            { icon: "🚚", title: "Receive & Enjoy", desc: "Get your items delivered to your doorstep and enjoy using them.", bg: "bg-yellow-500" },
            { icon: "🔄", title: "Return Easily", desc: "Return items conveniently once you're done, hassle-free.", bg: "bg-pink-500" },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              className={`p-8 ${step.bg} rounded-xl shadow-xl transform transition hover:scale-105 hover:shadow-2xl text-white`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <div className="text-4xl mb-4 animate-bounce">{step.icon}</div>
              <h3 className="font-bold text-2xl md:text-3xl mb-2 tracking-wide">{step.title}</h3>
              <p className="text-white/90 text-sm md:text-base">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>





      {/* Footer */}
      <MFooter />
    </div>
  );
}
