'use client';

import MNavbar from "@/components/MNavbar";
import { auth, firestore } from "../../../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FaRupeeSign } from "react-icons/fa";

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
    <div className="bg-bgBlue w-screen h-screen flex flex-col">
      <MNavbar color={"light"} user={user} />

      <div className="flex flex-col w-full h-full bg-gray-200 py-4 overflow-auto hide-scroll items-center">

        <div className="flex flex-col w-[90%] bg-white p-6 rounded-lg shadow-lg">
          {product === "NSP" ? (
            <p className="text-2xl font-extrabold text-center">NO SUCH PRODUCT</p>
          ) : product === null && img === null ? (
            <p className="text-2xl font-extrabold text-center">Loading product...</p>
          ) : (
            <div className="flex w-full bg-black rounded-lg overflow-hidden shadow-md">
              <Swiper
                className="w-full"
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
              >
                {product.imgurls.map((item) => (
                  <SwiperSlide key={item} className="flex w-full justify-center items-center">
                    <img
                      src={item}
                      alt="Product Image"
                      className="w-full md:h-[500px] object-contain pointer-events-none select-none"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        {(product && product !== "NSP") && <div className="flex flex-col w-[90%] bg-white p-6 mt-4 rounded-lg shadow-lg space-y-3">
          <p className="text-3xl font-bold text-gray-900">{product?.name}</p>

          <div className="flex items-center text-xl font-bold space-x-1">
            <FaRupeeSign className="text-lg" />
            <span>{product?.price}</span>
          </div>

          <p className="text-base text-gray-600">{product?.description}</p>
        </div>}

        
      </div>
    </div>
  );
}