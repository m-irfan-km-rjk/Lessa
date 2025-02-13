import Image from "next/image";
import Link from "next/link";
import { LiaRupeeSignSolid } from "react-icons/lia";

function ItemCard({ info }) {
    return (
        <div className="flex border-2 hover:bg-gray-300 transition-colors duration-300 h-full">
            {/* Image container with fixed dimensions */}
            <div className="border-2 bg-gray-300 p-1 flex justify-center items-center">
                <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] relative overflow-hidden">
                    <Image 
                        src={info.image} 
                        alt="Item Image" 
                        layout="fill" 
                    />
                </div>
            </div>
            <Link href={info.route}>
                <div className="w-full p-2 space-y-3 text-lg flex flex-col justify-center">
                    <p className="font-bold">{info.name}</p>
                    <div className="flex items-center space-x-1">
                        <LiaRupeeSignSolid /><span>{info.price}</span>
                    </div>
                    <p>{info.address}</p>
                </div>
            </Link>
        </div>
    );
}

export default ItemCard;