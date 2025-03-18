'use client';

import { auth,firestore, storage } from "../../../../../config";
import { useEffect, useState } from "react";
import { LiaBoxSolid, LiaPenSolid, LiaRupeeSignSolid, LiaTagSolid } from "react-icons/lia";
import { FaTag, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import MNavbar from "@/components/MNavbar";
import { FaLaptop, FaCouch, FaDumbbell, FaBook, FaCar, FaPuzzlePiece, FaPaw, FaIndustry } from "react-icons/fa";

export default function ProductCreate() {
    const marketplaceCategories = [
        {
            category: "Electronics",
            icon: <FaLaptop />,
            items: [
                { name: "Smartphones & Accessories", brands: ["Apple", "Samsung", "OnePlus", "Google", "Xiaomi", "Other brands"] },
                { name: "Laptops & Computers", brands: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Other brands"] },
                { name: "Smartwatches & Wearables", brands: ["Apple", "Samsung", "Garmin", "Fitbit", "Amazfit", "Other brands"] },
                { name: "Cameras & Drones", brands: ["Canon", "Nikon", "Sony", "DJI", "GoPro", "Other brands"] },
                { name: "Audio & Headphones", brands: ["Sony", "Bose", "JBL", "Sennheiser", "Apple", "Other brands"] },
                { name: "Gaming Consoles & Accessories", brands: ["Sony PlayStation", "Microsoft Xbox", "Nintendo", "Logitech", "Razer", "Other brands"] }
            ]
        },
        {
            category: "Home & Furniture",
            icon: <FaCouch />,
            items: [
                { name: "Sofas & Seating", brands: ["Ikea", "Urban Ladder", "Home Centre", "Pepperfry", "Other brands"] },
                { name: "Beds & Mattresses", brands: ["Wakefit", "Sleepwell", "Kurlon", "Duroflex", "Other brands"] },
                { name: "Tables & Chairs", brands: ["Ikea", "Nilkamal", "Durian", "Godrej Interio", "Other brands"] },
                { name: "Kitchen & Dining Furniture", brands: ["Ikea", "Godrej Interio", "Urban Ladder", "Other brands"] },
                { name: "Home Decor & Lighting", brands: ["Philips", "Syska", "Wipro", "Havells", "Other brands"] }
            ]
        },
        {
            category: "Sports & Fitness",
            icon: <FaDumbbell />,
            items: [
                { name: "Gym Equipment", brands: ["Bowflex", "PowerMax", "Fitkit", "Durafit", "Other brands"] },
                { name: "Outdoor & Adventure Gear", brands: ["Quechua", "Wildcraft", "Columbia", "The North Face", "Other brands"] }
            ]
        },
        {
            category: "Books & Stationery",
            icon: <FaBook />,
            items: [
                { name: "Academic Books", brands: ["Pearson", "McGraw Hill", "Cambridge", "Oxford", "Other brands"] },
                { name: "Novels & Magazines", brands: ["Penguin", "HarperCollins", "Hachette", "Random House", "Other brands"] },
                { name: "Office Supplies", brands: ["Staples", "Faber-Castell", "Parker", "Classmate", "Other brands"] },
                { name: "Art & Craft Supplies", brands: ["Camel", "Brustro", "Staedtler", "Faber-Castell", "Other brands"] }
            ]
        },
        {
            category: "Automotive",
            icon: <FaCar />,
            items: [
                { name: "Car Accessories", brands: ["Bosch", "Michelin", "3M", "Osram", "Other brands"] },
                { name: "Motorcycle Parts", brands: ["Yamaha", "Honda", "Bajaj", "TVS", "Other brands"] },
                { name: "Helmets & Safety Gear", brands: ["Studds", "Vega", "Axor", "Steelbird", "Other brands"] }
            ]
        },
        {
            category: "Toys & Baby Products",
            icon: <FaPuzzlePiece />,
            items: [
                { name: "Kids' Toys", brands: ["Lego", "Hasbro", "Mattel", "Hot Wheels", "Other brands"] },
                { name: "Learning & Educational Toys", brands: ["Melissa & Doug", "Fisher-Price", "LeapFrog", "VTech", "Other brands"] }
            ]
        },
        {
            category: "Pet Supplies",
            icon: <FaPaw />,
            items: [
                { name: "Pet Grooming", brands: ["Pedigree", "Royal Canin", "Drools", "Himalaya", "Other brands"] },
                { name: "Beds & Accessories", brands: ["Trixie", "Petslife", "MidWest", "Other brands"] }
            ]
        },
        {
            category: "Industrial & Business Supplies",
            icon: <FaIndustry />,
            items: [
                { name: "Tools & Machinery", brands: ["Bosch", "Makita", "DeWalt", "Black & Decker", "Other brands"] },
                { name: "Safety Equipment", brands: ["3M", "Honeywell", "Karam", "Udyogi", "Other brands"] },
                { name: "Office Electronics", brands: ["HP", "Epson", "Canon", "Brother", "Other brands"] }
            ]
        }
    ];    
    const [category, setCategory] = useState(null);
    const [user, setUser] = useState(null);
    const [price, setPrice] = useState(null);
    const [item, setItem] = useState(null);
    const [tags, setTags] = useState([]);
    const [images, setImages] = useState([]);
    const [progress, setProgress] = useState(0);
    const [description, setDescription] = useState(null);
    const [cbtn, setCbtn] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                console.log(user);
            } else {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, []);

    const createProduct = async () => {

        setCbtn(false);

        const imgUrls = await handleUpload(images);
    
        const prodDetails = {
            author: user.uid,
            name: item,
            imgurls: imgUrls,
            tags: tags,
            price: price,
            description: description
        };
        
        const docref = await addDoc(collection(firestore, 'products'), prodDetails);

        // Add product details to Firestore
        await updateDoc(doc(firestore, "users", user.uid), {
            products: arrayUnion(docref.id),
        });

        await updateDoc(doc(firestore, "products", "all_products"), {
            list: arrayUnion(item),
        })
    
        console.log("Product created successfully!");
    };

    const handleUpload = (images) => {
        return new Promise((resolve, reject) => {
            const imgUrls = [];
            const totalBytes = images.reduce((total, image) => total + image.size, 0);
            let uploadedBytes = 0;
    
            images.forEach((image, index) => {
                const storageRef = ref(storage, `images/products/${user.displayName+"_"+image.name+"_"+Date.now()}`);
                const uploadTask = uploadBytesResumable(storageRef, image);
    
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const individualProgress = (snapshot.bytesTransferred / snapshot.totalBytes);
                        uploadedBytes += snapshot.bytesTransferred;
                        const totalProgress = (uploadedBytes / totalBytes) * 100;
                        setProgress(totalProgress.toFixed(2));
                    },
                    (error) => reject(error),
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        imgUrls.push(downloadURL);
                        if (imgUrls.length === images.length) {
                            resolve(imgUrls); // Resolve with all URLs when done
                        }
                    }
                );
            });
        });
    };

    const handleRemoveTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleAddTags = (value) => {
        const newTags = value.split(" ").filter(item => item != "");
        const uniqueTags = newTags.filter(tag => !tags.includes(tag));

        setTags((prev) => [...prev,...uniqueTags]);
    }

    const handleFileChange = (e) => {
        const newFile = Array.from(e.target.files);
        setImages((prev) => [...prev,...newFile]);
    };

    const handleDelete = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-bgBlue w-screen h-full flex flex-col space-y-2 overflow-auto">
            <MNavbar color={"light"} user={user} />
            <div className="flex justify-center h-full items-center w-full mt-2 bg-gray-200 py-2 px-2 overflow-hidden">
                <div className="flex flex-col bg-white bg-opacity-90 rounded-lg shadow-lg p-6 w-full space-y-4 md:w-[50%] overflow-y-auto">
                    <p className="text-3xl font-extrabold md:text-center text-black py-1">
                        Add a New Rental Item
                    </p>
    
                    {category === null && (
                        <div className="p-2 space-y-2">
                            <p className="p-2">Select the Category</p>
                            {marketplaceCategories.map((item, key) => (
                                <button
                                    key={key}
                                    className="border-gray-100 flex p-3 text-lg gap-3 hover:bg-gray-100 cursor-pointer w-full"
                                    onClick={() => setCategory(key)}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    {item.category}
                                </button>
                            ))}
                        </div>
                    )}
    
                    {category !== null && (
                        <div className="flex flex-col space-y-5 mb-4">
                            <p className="text-xl font-bold">Details</p>
    
                            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                                <LiaBoxSolid className="text-xl text-black mr-4" />
                                <input
                                    type="text"
                                    name="product"
                                    className="flex-1 bg-transparent text-gray-800 px-4 focus:outline-none placeholder:text-gray-500"
                                    placeholder="Item Name"
                                    onChange={(e) => setItem(e.target.value || null)}
                                />
                            </div>
    
                            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                                <LiaRupeeSignSolid className="text-xl text-black mr-4" />
                                <input
                                    type="number"
                                    name="price"
                                    className="flex-1 bg-transparent text-gray-800 px-4 focus:outline-none placeholder:text-gray-500"
                                    placeholder="Price"
                                    onChange={(e) => setPrice(e.target.value || null)}
                                />
                            </div>
    
                            <div className="flex items-start border-b-2 border-t-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                                <LiaPenSolid className="text-xl text-black mr-4 mt-1" />
                                <textarea
                                    name="description"
                                    rows="3"
                                    className="flex-1 bg-transparent text-gray-800 px-4 focus:outline-none placeholder:text-gray-500 resize-none"
                                    placeholder="Description"
                                    onChange={(e) => setDescription(e.target.value || null)}
                                />
                            </div>
    
                            {/* Image Upload Section */}
                            <div className="w-full flex items-center justify-center bg-white rounded-lg shadow-md gap-4 h-[30%] p-4">
                                <div className="grid md:grid-cols-4 grid-cols-1 p-2 gap-2 w-full border-r-2 border-gray-300 h-full overflow-y-auto">
                                    {images.map((img, key) => (
                                        <div key={key} className="bg-gray-200 flex justify-between items-center rounded-lg shadow-sm p-2 transition-transform transform hover:scale-105">
                                            <Image className="rounded" src={URL.createObjectURL(img)} width={70} height={70} alt={`Uploaded image ${key}`} />
                                            <span onClick={() => handleDelete(key)} className="text-red-500 h-full border-l-2 border-white p-2 flex justify-center items-center cursor-pointer hover:bg-red-100 transition-colors">
                                                <FaTrash />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="h-full flex flex-col p-2 justify-between md:w-[20%]">
                                    <input type="file" multiple className="hidden" id="file-upload" onChange={handleFileChange} />
                                    <label htmlFor="file-upload" className="bg-blue-600 rounded-md text-sm md:mb-4 p-1 cursor-pointer text-center text-white hover:bg-blue-700 transition-colors">
                                        Add Image
                                    </label>
                                    <div className="w-full h-5 p-1 rounded-lg bg-blue-400 flex">
                                        <div className="bg-white rounded-lg" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            </div>
    
                            {/* Tags Input Section */}
                            <div className="flex gap-1 items-center border-b-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                                <FaTag className="text-xl text-black mr-4" />
                                <input
                                    type="text"
                                    name="price"
                                    className="bg-transparent text-gray-800 text-sm w-full focus:outline-none placeholder:text-gray-500"
                                    placeholder="Add tags"
                                    id="tags"
                                />
                                <button className="p-2 bg-blue-600 text-white rounded-sm" onClick={() => {
                                    handleAddTags(document.getElementById("tags").value);
                                    document.getElementById("tags").value = "";
                                }}>Generate</button>
                                <button className="p-2 bg-blue-600 text-white rounded-sm" onClick={() => setTags([])}>Reset</button>
                            </div>
    
                            <div className="grid md:grid-cols-5 grid-cols-1 min-h-[100px] max-h-[100px] overflow-auto p-2 w-full bg-gray-100 h-auto gap-2 rounded-lg shadow-md border border-gray-300">
                                {tags.map((tag, index) => (
                                    <span key={index} className="bg-blue-600 flex items-center justify-between p-2 rounded-full text-white text-sm transition-transform transform hover:scale-105 cursor-pointer">
                                        {tag}
                                        <button onClick={() => handleRemoveTag(index)} className="ml-2 text-white hover:text-gray-200 focus:outline-none" aria-label={`Remove tag ${tag}`}>
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
    
                            <button disabled={!item || images.length === 0 || tags.length === 0 || !description || !cbtn} className="w-full disabled:bg-red-500 bg-blue-600 hover:bg-blue-700 p-1 text-white rounded-lg" onClick={createProduct}>
                                Create Rental Product
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );    
}
/*
<div className="flex justify-center items-center w-full h-full bg-gray-200 py-2 px-2">
                <div className="flex flex-col bg-white bg-opacity-90 rounded-lg shadow-lg p-6 w-full space-y-4 md:w-[50%] md:max-h-[98vh] overflow-auto">
                    <p className="text-3xl font-extrabold md:text-center text-black py-1">Add a New Rental Item</p>
                    
                    <div className="flex items-center border-b-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                        <LiaBoxSolid className="text-xl text-black mr-4" />
                        <input 
                            type="text" 
                            name="product" 
                            className="flex-1 bg-transparent text-gray-800 px-4 focus:outline-none placeholder:text-gray-500" 
                            placeholder="Item Name" 
                            onChange={(e) => {
                                if (e.target.value !== "") {
                                    setItem(e.target.value);
                                } else {
                                    setItem(null);
                                }
                            }} 
                        />
                    </div>

                    <div className="flex items-center border-b-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                        <LiaRupeeSignSolid className="text-xl text-black mr-4" />
                        <input 
                            type="number" 
                            name="price" 
                            className="flex-1 bg-transparent text-gray-800 px-4 focus:outline-none placeholder:text-gray-500" 
                            placeholder="Price" 
                            onChange={(e) => {
                                if (e.target.value !== "") {
                                    setPrice(e.target.value);
                                } else {
                                    setPrice(null);
                                }
                            }} 
                        />
                    </div>

                    <div className="flex items-start border-b-2 border-t-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                        <LiaPenSolid className="text-xl text-black mr-4 mt-1" />
                        <textarea
                            name="description"
                            rows="3"
                            className="flex-1 bg-transparent text-gray-800 px-4 focus:outline-none placeholder:text-gray-500 resize-none"
                            placeholder="Description"
                            onChange={(e) => {
                                if (e.target.value !== "") {
                                    setDescription(e.target.value);
                                } else {
                                    setDescription(null);
                                }
                            }}
                        />
                    </div>



                    <div className="w-full flex items-center justify-center bg-white rounded-lg shadow-md gap-4 h-[30%] p-4">
                        <div className="grid md:grid-cols-4 grid-cols-1 p-2 gap-2 w-full border-r-2 border-gray-300 h-full overflow-y-auto">
                            {images.map((img, key) => (
                                <div key={key} className="bg-gray-200 flex justify-between items-center rounded-lg shadow-sm p-2 transition-transform transform hover:scale-105">
                                    <Image className="rounded" src={URL.createObjectURL(img)} width={70} height={70} alt={`Uploaded image ${key}`} />
                                    <span key={key} onClick={() => handleDelete(key)} className="text-red-500 h-full border-l-2 border-white p-2 flex justify-center items-center cursor-pointer hover:bg-red-100 transition-colors">
                                        <FaTrash/>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="h-full flex flex-col p-2 justify-between md:w-[20%]">
                            <input type="file" multiple className="hidden" id="file-upload" onChange={handleFileChange} />
                            <label htmlFor="file-upload" className="bg-blue-600 rounded-md text-sm md:mb-4 p-1 cursor-pointer text-center text-white hover:bg-blue-700 transition-colors">
                                Add Image
                            </label>
                            <div className="w-full h-5 p-1 rounded-lg bg-blue-400 flex">
                                <div className="bg-white rounded-lg" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>


                    <div className="flex gap-1 items-center border-b-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                        <FaTag className="text-xl text-black mr-4" />
                        <input 
                            type="text" 
                            name="price" 
                            className="bg-transparent text-gray-800 text-sm w-full focus:outline-none placeholder:text-gray-500" 
                            placeholder="Add tags"
                            id="tags" 
                        />
                        <button className="p-2 bg-blue-600 text-white rounded-sm" onClick={() => {
                            handleAddTags(document.getElementById("tags").value);
                            document.getElementById("tags").value = "";
                        }}>Generate</button>
                        <button className="p-2 bg-blue-600 text-white rounded-sm" onClick={() => {
                            setTags([]);
                        }}>Reset</button>
                    </div>
                    <div className="grid md:grid-cols-5 grid-cols-1 min-h-[100px] max-h-[100px] overflow-auto p-2 w-full bg-gray-100 h-auto gap-2 rounded-lg shadow-md border border-gray-300">
                        {tags.map((tag, index) => (
                            <span key={index} className="bg-blue-600 flex items-center justify-between p-2 rounded-full text-white text-sm transition-transform transform hover:scale-105 cursor-pointer">
                                {tag}
                                <button 
                                    onClick={() => handleRemoveTag(index)} 
                                    className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                                    aria-label={`Remove tag ${tag}`}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                    <button disabled={(!item || images.length == 0 || tags.length == 0 || !description || !cbtn)} className="w-full disabled:bg-red-500 bg-blue-600 hover:bg-blue-700 p-1 text-white rounded-lg" onClick={createProduct}>Create Rental Product</button>
                </div>
            </div>
 */