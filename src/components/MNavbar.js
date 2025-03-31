import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import SearchBar from "./SearchBar";

export default function MNavbar({user,color,search}) {
    var textcolor = (color=="light")?"white":"black";
    return(
    <div className="w-full px-3 md:px-7 py-1 md:py-2">
        <div className={"container mx-auto flex flex-col md:flex-row justify-between items-center text-"+textcolor}>
            <div className="w-32 mb-4 md:mb-0">
                <Image src={(color=="light")?"/logo.png":"/logo_black.png"} alt="Mediater" width={200} height={10} />
            </div>
            {(search=="true")?(
            <SearchBar/>):(<></>)}
            <nav className="flex mb-4 md:mb-0">
                <Link href="#" className="p-2 md:px-3">Home</Link>
                <Link href="#" className="p-2 md:px-3">About</Link>
                <Link href="#" className="p-2 md:px-3">Rentals</Link>
                <Link href="#" className="p-2 md:px-3">Contact</Link>
                {(user)?<Image src={user.photoURL} className="rounded-full p-1" width={50} height={50}/>:<Link><button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</button></Link>}
            </nav>
        </div>
    </div>
    );
}