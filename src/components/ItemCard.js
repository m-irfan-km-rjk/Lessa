import Image from "next/image";
import Link from "next/link";
import { LiaRupeeSignSolid } from "react-icons/lia";

function ItemCard({ info }) {
    return (
        <div className="flex md:flex-col flex-row border-2 hover:bg-gray-300 transition-colors duration-300 md:h-70 h-35">
            {/* Image container with fixed dimensions */}
            <div className="border-2 bg-black p-1 flex justify-center items-center">
                <div className="w-[130px] h-[130px] md:w-[160px] md:h-[160px] relative overflow-hidden">
                    <Image 
                        src={info.image} 
                        alt="Item Image" 
                        layout="fill" 
                    />
                </div>
            </div>
            <Link href={info.route || "/marketplace/product"+info.id} className="w-full">
                <div className="w-full p-2 space-y-2 md:text-lg text-xs flex flex-col justify-center h-full">
                    {/* Name limited to one line */}
                    <p className="font-bold truncate w-full max-w-[140px] md:max-w-[240px]">{info.name}</p>
                    <div className="flex items-center space-x-1">
                        <LiaRupeeSignSolid /><span>{info.price}</span>
                    </div>
                    {/* Address remains hidden on small screens */}
                    <p className="text-xs truncate">{info.address[1]}</p>
                </div>
            </Link>
        </div>
    );
}

export default ItemCard;