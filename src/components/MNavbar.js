import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function MNavbar({user,color,search}) {
    var textcolor = (color=="light")?"white":"black";
    return(
    <div className="w-full px-3 md:px-7 py-1 md:py-2">
        <div className={"container mx-auto flex flex-col md:flex-row justify-between items-center text-"+textcolor}>
            <div className="w-32 mb-4 md:mb-0">
                <Image src={(color=="light")?"/logo.png":"/logo_black.png"} alt="Mediater" width={200} height={10} />
            </div>
            {(search=="true")?(
            <div className="flex border-2 rounded-md md:w-[43%] w-full mb-2 md:mb-0">
                <input className="w-full p-1 text-black" type="text" placeholder="Search Items"/>
                <button type="button" className="p-2 bg-yellow-400 text-black"><FaSearch/></button>
            </div>):(<></>)}
            <nav className="flex mb-4 md:mb-0">
                <Link href="#" className="p-2 md:px-3">Home</Link>
                <Link href="#" className="p-2 md:px-3">About</Link>
                <Link href="#" className="p-2 md:px-3">Rentals</Link>
                <Link href="#" className="p-2 md:px-3">Contact</Link>
                {(user)?<Image src={user.photoURL} className="rounded-full p-1" width={50} height={50}/>:<button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</button>}
            </nav>
        </div>
    </div>
    );
}