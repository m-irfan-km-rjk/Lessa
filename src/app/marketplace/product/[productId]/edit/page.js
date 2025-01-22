"use client"

import MNavbar from "@/components/MNavbar";
import { auth,firestore } from "../../../../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";
import Image from "next/image";
import { LiaBoxSolid, LiaPenSolid, LiaRupeeSignSolid, LiaTagSolid } from "react-icons/lia";
import { FaTag, FaTrash } from "react-icons/fa";

const EditProductPage = ({ params }) => {
  const { productId } = params; // Product ID from the route
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState("");
  const [item, setItem] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [cbtn, setCbtn] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user); // Set the logged-in user
        try {
          // Query Firestore for the product with matching ID and author
          const productQuery = query(
            collection(firestore, "products"),
            where("author", "==", user.uid), // Ensure user is the author
            where("__name__", "==", productId) // Match the document ID with productId
          );

          const querySnapshot = await getDocs(productQuery);
          if (!querySnapshot.empty) {
            const productData = querySnapshot.docs[0].data();
            setProduct(productData);
            setPrice(productData.price);
            setItem(productData.name);
            setTags(productData.tags);
            setImages(productData.imgurls);
            setDescription(productData.description);
          } else {
            setProduct("NSP");
          }
        } catch (e) {
          console.error("Error fetching product data:", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [firestore, productId, auth]);

    const handleRemoveTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleAddTags = (value) => {
        const newTags = value.split(" ").filter(item => item != "");
        const uniqueTags = newTags.filter(tag => !tags.includes(tag));

        setTags((prev) => [...prev,...uniqueTags]);
    }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (product === "NSP") {
    return <p>No such product exists or you are not authorized to edit this product.</p>;
  }

  return (
    <div className="flex h-screen bg-[url('/login_bg_v.png')] md:bg-[url('/login_bg.png')] bg-cover justify-center items-center overflow-hidden">
            <div className="flex bg-black/70 h-full w-full justify-center items-center p-6">
                <div className="flex flex-col bg-white bg-opacity-90 rounded-lg shadow-lg p-6 space-y-4 md:w-[50%] h-full md:max-h-[98vh] overflow-auto hide-scroll">
                    <p className="text-3xl font-extrabold md:text-center text-black py-2">Edit Rental Item</p>
                    
                    <div className="flex items-center border-b-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                        <LiaBoxSolid className="text-xl text-black mr-4" />
                        <input 
                            type="text" 
                            name="product" 
                            className="flex-1 bg-transparent text-gray-800 px-4 focus:outline-none placeholder:text-gray-500" 
                            value={item} 
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
                            value={price}
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
                            value={description}
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
                            {images != null && images.map((img, key) => (
                                <div key={key} className="bg-gray-200 flex justify-between items-center rounded-lg shadow-sm p-2 transition-transform transform hover:scale-105">
                                    <Image className="rounded" src={img} width={70} height={70} alt={`Uploaded image ${key}`} />
                                    <span key={key} onClick={() => {}} className="text-red-500 h-full border-l-2 border-white p-2 flex justify-center items-center cursor-pointer hover:bg-red-100 transition-colors">
                                        <FaTrash/>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="h-full flex flex-col p-2 justify-between md:w-[20%]">
                            <input type="file" multiple className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="bg-blue-600 rounded-md text-sm md:mb-4 p-1 cursor-pointer text-center text-white hover:bg-blue-700 transition-colors">
                                Add Image
                            </label>
                            <div className="w-full h-5 p-1 rounded-lg bg-blue-400 flex">
                                <div className="bg-white rounded-lg" style={{ width: `${20}%` }} />
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
                    <div className="grid md:grid-cols-5 grid-cols-1 overflow-auto md:overflow-visible p-2 w-full bg-gray-100 h-[40%] gap-2 rounded-lg shadow-md border border-gray-300">
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
                    <button disabled={(!item || images && images.length == 0 || tags.length == 0 || !description || !cbtn)} className="w-full disabled:bg-red-500 bg-blue-600 hover:bg-blue-700 p-1 text-white rounded-lg" onClick={()=>{}}>Create Rental Product</button>
                </div>
            </div>
        </div>
  );
};

export default EditProductPage;