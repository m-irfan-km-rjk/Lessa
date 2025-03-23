import Image from "next/image";
import Link from "next/link";
import { LiaRupeeSignSolid } from "react-icons/lia";

function ItemCard({ info }) {
    return (
        <div className="flex flex-col md:flex-row border-2 hover:bg-gray-300 transition-colors duration-300 h-50 md:h-48">
            {/* Image container with fixed dimensions */}
            <div className="border-2 bg-gray-300 p-1 flex justify-center items-center">
                <div className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] relative overflow-hidden">
                    <Image 
                        src={info.image} 
                        alt="Item Image" 
                        layout="fill" 
                    />
                </div>
            </div>
            <Link href={info.route} className="w-full">
                <div className="w-full p-2 space-y-2 text-lg flex flex-col justify-center h-full">
                    {/* Name limited to one line */}
                    <p className="font-bold truncate w-full max-w-[300px]">{info.name}</p>
                    <div className="flex items-center space-x-1">
                        <LiaRupeeSignSolid /><span>{info.price}</span>
                    </div>
                    {/* Address remains hidden on small screens */}
                    <p className="hidden md:block text-sm truncate">{info.address}</p>
                </div>
            </Link>
        </div>
    );
}

export default ItemCard;