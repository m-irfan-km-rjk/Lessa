'use client';

import { auth, firestore, storage } from '../../../../config';
import { createUserWithEmailAndPassword, EmailAuthProvider, linkWithCredential, updateProfile } from 'firebase/auth';
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaUser, FaHome } from "react-icons/fa";
import { MdMail, MdLock } from "react-icons/md";
import { doc, setDoc } from 'firebase/firestore';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import MNavbar from "@/components/MNavbar";

export default function CreatePage() {
    const [img, setImg] = useState(null);
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [zip, setZip] = useState("");
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        setUser(auth.currentUser);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setImg(file);
    };

    const addUser = async () => {
        try {
            let imgurl = null;
            let user;

            if (auth.currentUser) {
                await auth.signOut();
            }

            if (!auth.currentUser?.providerData.some((profile) => profile.providerId === "google.com")) {
                const userCredentials = await createUserWithEmailAndPassword(auth, mail, password);
                user = userCredentials.user;
            } else {
                const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
                await linkWithCredential(auth.currentUser, credential);
                user = auth.currentUser;
            }

            if (img) {
                const uploadTask = uploadBytesResumable(ref(storage, `images/users/${user.uid}/profile`), img);
                imgurl = await new Promise((res, rej) => {
                    uploadTask.on("state_changed", null, rej, async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        res(url);
                    });
                });
            }

            await setDoc(doc(firestore, "users", user.uid), {
                email: mail,
                username: username,
                address: { state, city, district, zip },
                img: imgurl,
                products: [],
                product_no: 0,
            });

            await updateProfile(user, { photoURL: imgurl, displayName: username });
            router.push("/marketplace");
        } catch (e) {
            alert(e.message || "An error occurred.");
        }
    };

    return (
        <div className="bg-bgBlue w-screen h-full flex flex-col space-y-2 overflow-auto">
            <MNavbar color="light" user={user} />
            <div className="flex justify-center h-full items-center w-full mt-2 bg-gray-200 py-2 px-2 overflow-hidden">
                <div className="flex flex-col bg-white bg-opacity-90 rounded-lg shadow-lg p-6 w-full space-y-4 md:w-[50%] overflow-y-auto">
                    <p className="text-3xl font-extrabold md:text-center text-black py-1">Create Profile</p>

                    <input type="file" id="filein" onChange={handleFileChange} className="hidden" />
                    <div className="flex justify-center items-center mb-4">
                        {img ? (
                            <Image src={URL.createObjectURL(img)} width={170} height={170} className="rounded-full border-2 border-gray-300 shadow-md" alt="Profile" />
                        ) : (
                            <div className="flex border-2 border-gray-300 rounded-full justify-center items-center bg-gray-100 h-[200px] w-[200px]">
                                <FaUser size={100} />
                            </div>
                        )}
                    </div>
                    <label className="bg-blue-500 text-white rounded-lg py-2 px-4 cursor-pointer text-center hover:bg-blue-600 transition-colors" htmlFor="filein">Add Image</label>

                    {[{ label: "Email", icon: <MdMail />, state: setMail },
                    { label: "Password", icon: <MdLock />, state: setPassword, type: "password" },
                    { label: "Username", icon: <FaUser />, state: setUsername }].map(({ label, icon, state, type = "text" }, idx) => (
                        <div key={idx} className="flex items-center border-b-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                            {icon}
                            <input type={type} placeholder={label} className="flex-1 bg-transparent text-gray-800 px-4 focus:outline-none placeholder:text-gray-500" onChange={(e) => state(e.target.value || "")} />
                        </div>
                    ))}

                    <hr className="border-black my-4" />

                    <div className="flex gap-2 text-xl font-bold">Address <FaHome size={25} /></div>
                    {[{ label: "City", state: setCity }, { label: "District", state: setDistrict }, { label: "State", state: setState }, { label: "Zip Code", state: setZip }].map(({ label, state }, idx) => (
                        <div key={idx} className="flex items-center border-b-2 border-gray-300 focus-within:border-black py-3 w-full transition-colors duration-700">
                            <input type="text" placeholder={label} className="flex-1 bg-transparent text-gray-800 px-4 focus:outline-none placeholder:text-gray-500" onChange={(e) => state(e.target.value || "")} />
                        </div>
                    ))}

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:bg-red-500" disabled={!mail || !password || !city || !district || !state || !zip} onClick={addUser}>Create Profile</button>
                </div>
            </div>
        </div>
    );
}
