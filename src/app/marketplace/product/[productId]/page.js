'use client';

import MNavbar from "@/components/MNavbar";
import { auth, firestore } from "../../../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { LiaRupeeSignSolid } from "react-icons/lia";

export default function ProductID({ params }) {
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const [img, setImg] = useState(null);
  const { productId } = params;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        try {
          const productDoc = await getDoc(doc(firestore, 'products', productId));
          if (productDoc.exists()) {
            const productData = productDoc.data();
            setProduct(productData);
            setImg(productData.imgurls[0]); // Set the first image as default
          } else {
            setProduct("NSP");
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [productId]);

  return (
    <div className="bg-bgBlue w-screen h-screen flex flex-col space-y-2">
      <MNavbar color={"light"} user={user} />
      <div className="flex flex-col space-y-1 w-full h-full bg-gray-200 px-10 py-2 overflow-auto hide-scroll" id="content">
        <div className="flex flex-col w-full bg-white p-4" id="product_info">
          {product === "NSP" ? (
            <p className="text-2xl font-extrabold">NO SUCH PRODUCT</p>
          ) : product === null && img === null ? (
            <p className="text-2xl font-extrabold">Loading product</p>
          ) : (
            <div className="flex w-full space-x-3">
              {/* Main Image Section */}
              <div className="flex w-[70%] flex-col border-2">
                <div className="flex w-full">
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden">
                    {/* Main Image */}
                    <Image
                      src={img || product.imgurls[0]} // Display selected image
                      alt="Selected Product"
                      className="object-contain"
                      width={500}
                      height={500}
                      priority // Ensure main image is loaded immediately
                    />
                  </div>
                  <div className="grid grid-cols-1 p-1 h-full w-[20%] overflow-auto hide-scroll">
                    {/* Thumbnails */}
                    {product.imgurls.map((item, key) => (
                      <div
                        className="w-full flex items-center justify-center border-2 bg-white relative overflow-hidden"
                        key={key}
                        onClick={() => setImg(item)} // Update main image
                      >
                        {/* Use the same source as the main image */}
                        <Image
                          src={item}
                          alt={`Product image ${key + 1}`}
                          className="object-contain transition-transform duration-200 hover:scale-105"
                          width={80} // Thumbnail size
                          height={80}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <hr />
                <div className="flex p-2 space-x-4">
                  <button className="bg-green-500 p-3 rounded-md flex-1 text-white font-bold hover:bg-green-300 hover:text-black">
                    Rent Item
                  </button>
                  <button className="bg-green-500 p-3 rounded-md flex-1 text-white font-bold hover:bg-green-300 hover:text-black">
                    Contact Owner
                  </button>
                </div>
              </div>
              {/* Product Details Section */}
              <div className="p-1 space-y-3 w-full h-full">
                <p className="text-4xl font-extrabold">{product.name}</p>
                <div className="flex items-center">
                  <LiaRupeeSignSolid />
                  <p className="text-2xl font-extrabold">{product.price}</p>
                </div>
                <hr />
                <div
                  style={{ whiteSpace: "pre-wrap" }}
                  className="text-sm"
                >
                  {product.description}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex w-full bg-white p-3">
          <div className="">
            
          </div>
        </div>
      </div>
    </div>
  );
}