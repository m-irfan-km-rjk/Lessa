"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import client from "../../api/client";
import { IoCloudUploadOutline, IoCloseCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CreateProduct() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Electronics",
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadImage = async (file) => {
        try {
            setUploading(true);
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await client.storage
                .from("product-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = client.storage.from("product-images").getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error("Error uploading image: ", error);
            alert("Error uploading image");
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !imageFile) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        setLoading(true);

        // 1. Check if user is logged in
        const { data: { user } } = await client.auth.getUser();
        if (!user) {
            alert("You must be logged in to create a product.");
            router.push("/login");
            return;
        }

        try {
            // 2. Upload Image
            const imageUrl = await uploadImage(imageFile);
            if (!imageUrl) return;

            // 3. Insert into Database
            const { error } = await client
                .from("products")
                .insert([{
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    imageUrl: imageUrl,
                    owner_id: user.id
                }]);

            if (error) throw error;

            alert("Product created successfully!");
            router.push("/shop");
        } catch (error) {
            console.error("Error creating product:", error);
            alert(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('/home_bg1.png')] bg-cover bg-center pt-[80px] pb-10 px-4 flex justify-center items-center relative">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 bg-gray-800 bg-opacity-90 max-w-2xl w-full rounded-2xl shadow-lg p-8"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">List Your Item</h1>
                    <p className="text-gray-300 mt-2">Share your items with the world instantly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Image Upload Area */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Product Image</label>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? "border-yellow-400 bg-gray-700" : "border-gray-500 hover:border-yellow-400 bg-gray-700"
                                }`}
                        >
                            <input {...getInputProps()} />
                            <AnimatePresence>
                                {preview ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative w-full h-full p-2"
                                    >
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setPreview(null); setImageFile(null); }}
                                            className="absolute top-4 right-4 text-red-500 text-2xl bg-white rounded-full shadow-md hover:scale-110 transition"
                                        >
                                            <IoCloseCircle />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center p-6"
                                    >
                                        <IoCloudUploadOutline className="text-6xl text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-300 font-medium">Drag & drop an image here, or click to select</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Wireless Headphones"
                                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-transparent focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300">Price (per day)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400">Rs.</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-transparent focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-transparent focus:ring-2 focus:ring-yellow-400 outline-none transition"
                        >
                            <option className="bg-gray-800 text-white">Electronics</option>
                            <option className="bg-gray-800 text-white">Fashion</option>
                            <option className="bg-gray-800 text-white">Home & Living</option>
                            <option className="bg-gray-800 text-white">Sports</option>
                            <option className="bg-gray-800 text-white">Books</option>
                            <option className="bg-gray-800 text-white">Tools</option>
                            <option className="bg-gray-800 text-white">Vehicles</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your item... (Condition, features, etc.)"
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-transparent focus:ring-2 focus:ring-yellow-400 outline-none transition h-32 resize-none"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading || uploading ? "Creating Product..." : "List Product Now"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
