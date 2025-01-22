import Image from 'next/image';
import Link from 'next/link';
import { LiaRupeeSignSolid } from "react-icons/lia";

function ItemCard({info}) {
    return(
        <div className='flex border-2 hover:bg-gray-300 transition-colors duration-300'>
            <div className="flex border-2 bg-gray-300 md:w-[20%] p-1 justify-center items-center">
                <Image className="" src={info.image} width={200} height={500} alt="Item Image" />
            </div>
            <div className="w-[100%] p-2 space-y-3 text-lg">
                <p className='font-bold'>{info.name}</p>
                <div className="flex items-center space-x-1"><LiaRupeeSignSolid /><span>{info.price}</span></div>
                <p>{info.address}</p>
            </div>
            
        </div>
    );
}

export default ItemCard;