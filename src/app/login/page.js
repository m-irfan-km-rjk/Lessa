'use client';
import { useState, useEffect } from "react";
import { auth, firestore } from "../../../config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser, FaLock } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

function Login() {
    const [mail, setMail] = useState(null);
    const [password, setPassword] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const signInWithEmail = async () => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, mail, password);
            router.push("/marketplace");
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                alert("The credentials are incorrect.");
            }
        }
    };

    return (
        <div className="flex h-screen bg-[url('/login_bg_v.png')] md:bg-[url('/login_bg.png')] bg-cover bg-center justify-center items-center overflow-hidden">
            <div className="flex bg-black/70 h-full w-full justify-center items-center p-2">
                <div className="flex bg-white bg-opacity-90 rounded-lg p-8 items-center md:w-[30%] w-[85%] justify-center flex-col space-y-6">
                    <Image src="/logo_black.png" className="p-2" width={200} height={10} alt="Logo"/>
                    
                    <div className="flex items-center border-b-2 focus-within:border-white border-gray-400 w-full p-3 space-x-3">
                        <FaUser className="text-xl text-black"/>
                        <input
                            type="text"
                            onChange={(e) => setMail(e.target.value)}
                            name="username"
                            className="rounded-sm bg-transparent text-black px-4 w-full focus:outline-none placeholder:text-gray-400"
                            placeholder="Username or Email"
                        />
                    </div>
                    
                    <div className="flex items-center border-b-2 focus-within:border-white border-gray-400 w-full p-3 space-x-3">
                        <FaLock className="text-xl text-black"/>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            className="rounded-sm bg-transparent text-black px-4 w-full focus:outline-none placeholder:text-gray-400"
                            placeholder="Password"
                        />
                    </div>
                    
                    <button className="bg-blue-600 w-full rounded-lg text-white p-3 text-lg font-bold hover:bg-blue-500" onClick={signInWithEmail}>
                        Login
                    </button>
                    <p>Already have an account? <Link href={"/profile/create"} className="text-lg text-blue-500 font-bold">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;