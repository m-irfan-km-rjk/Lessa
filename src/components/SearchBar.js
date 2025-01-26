'use client';

import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
    const [suggview, setSuggView] = useState(false);
    const [suggestions, setSuggestion] = useState([]);
    const divref = useRef();

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if(divref.current && !divref.current.contains(e.target)) {
                setSuggView(false);
            }
        });
    },[]);

    return(
        <div className="flex border-2 rounded-md md:w-[43%] w-full mb-2 md:mb-0 relative" ref={divref}>
            <div className="w-full flex flex-col">
                <input className="w-full block p-1 text-black" type="text" placeholder="Search Items" onChange={(wd) => {
                    if(wd.target.value !== "") {
                        var suggestions = fetch("api/suggestions",{
                            method: "POST",
                            body: JSON.stringify({keyword: wd.target.value}),
                        }).then((res) => {
                            if(!res.ok) {
                                throw new Error(res.statusText);
                            }
                            return (res.json());
                        }).then((data) => {
                            setSuggestion(data.suggestion);
                        });
                        setSuggView(true);
                    } else {
                        setSuggView(false);
                    }
                }} />
                {suggview && <div className="absolute top-9 flex w-full flex-col bg-white text-black border-gray-400 border-2 shadow-lg">
                    {suggestions.map((sugg) => {
                        return <div key={""} className="p-1 hover:bg-gray-100 cursor-pointer border-b-2"><FaSearch/>{sugg}</div>
                    })}
                </div>}
            </div>
            <button type="button" className="p-2 bg-yellow-400 text-black"><FaSearch /></button>
        </div>
    );
}