"use client";
import { useEffect, useState } from "react";
import client from "../../api/client";
import MNavbar from "@/components/MNavbar";
import { MFooter } from "@/components/MFooter";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IoFilter, IoSearchOutline } from "react-icons/io5";

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Electronics", "Fashion", "Home & Living", "Sports", "Books", "Tools", "Vehicles"];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await client
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <MNavbar color="light" search={false} />

            {/* Header & Filter Section */}
            <div className="pt-[80px] pb-8 px-4 md:px-12 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Explore Items</h1>
                        <Link href="/create-product">
                            <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition shadow-lg transform hover:-translate-y-1">
                                + List an Item
                            </button>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <IoSearchOutline className="absolute left-3 top-3.5 text-gray-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Search for items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none bg-gray-50"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat
                                            ? "bg-black text-white shadow-md"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-12 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    </div>
                ) : (
                    <>
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <p className="text-xl">No items found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                <AnimatePresence>
                                    {filteredProducts.map((product) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            key={product.id}
                                            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                                        >
                                            <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                                                {product.imageUrl ? (
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                                )}
                                                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                                    {product.category}
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{product.name}</h3>
                                                    <span className="font-bold text-blue-600 text-lg">Rs.{product.price}</span>
                                                </div>
                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>

                                                <button className="w-full py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition active:scale-95">
                                                    View Details
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}
            </div>

            <MFooter />
        </div>
    );
}
