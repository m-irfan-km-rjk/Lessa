import { NextResponse } from "next/server";
import { firestore } from "../../../../config";
import { doc, getDoc } from "firebase/firestore";

export async function POST(request) {

    const body = await request.json();
    const keyword = body.keyword;

    try {
        const docSnap = await getDoc(doc(firestore, "products","all_products"));
        const productList = docSnap.data().list;

        return NextResponse.json( {
            suggestion: productList.filter((prod) => prod.toLowerCase().includes(keyword.toLowerCase()))
        });
    } catch(error) {
        return NextResponse.json({
            error: "Error: "+error
        });
    }
}