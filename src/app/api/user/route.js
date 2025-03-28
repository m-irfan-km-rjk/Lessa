import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../config";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const uuid = searchParams.get("uuid");

        if (!uuid) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        // Fetch user data
        const userRef = doc(firestore, "users", uuid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userdata = userSnap.data();
        const { username, address, products: productIds = [] } = userdata;

        // Fetch product details
        const productData = await Promise.all(
            productIds.map(async (productId) => {
                const productRef = doc(firestore, "products", productId);
                const productSnap = await getDoc(productRef);
                return productSnap.exists() ? { id: productId, ...productSnap.data() } : null;
            })
        );

        // Filter out null products and construct the response
        const filteredProducts = productData
            .filter(Boolean) // Removes null values
            .map((data) => ({
                name: data.name,
                price: data.price,
                address,
                image: data.imgurls?.[0] || "", // Handle missing images safely
                route: `/marketplace/product/${data.id}`, // Use data.id instead of undefined docSnap
            }));

        // Construct final JSON response
        const responseJson = {
            username,
            address,
            productData: filteredProducts
        };

        return NextResponse.json(responseJson);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
