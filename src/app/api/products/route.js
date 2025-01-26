import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../config";

export async function GET(request) {
    const { params } = new URL(request.url);
    const noi = params.get('noi');

    const product_details_snap = await getDoc(doc(firestore,"products"))
}