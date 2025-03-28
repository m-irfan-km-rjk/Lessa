import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "../../../../config";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const noi = searchParams.get('noi');

    const products_snap = await getDocs(collection(firestore, "products"));
    const products = await Promise.all(
        products_snap.docs
            .filter((doc) => doc.id !== "all_products")
            .map(async (docSnap) => {
                const data = docSnap.data();
                const authorSnap = await getDoc(doc(firestore, "users", data.author));
                
                if (!authorSnap.exists()) {
                    return { name: data.name, price: data.price, address: "Unknown" };
                }

                const author = authorSnap.data();
                
                return { name: data.name, price: data.price, address: author.address, image: data.imgurls[0], route: `/marketplace/product/${docSnap.id}`};
            })
    );

    return NextResponse.json({ products });
}