'use client';

import { auth,firestore,storage } from '../../../../config';
import { createUserWithEmailAndPassword, EmailAuthProvider, linkWithCredential, updateProfile } from 'firebase/auth';
import { useState } from "react";
import Image from "next/image";
import { FcAddImage } from "react-icons/fc";
import { MdMail, MdLock } from "react-icons/md";
import { FaUser,FaHome } from "react-icons/fa";
import { doc,getDoc,setDoc } from 'firebase/firestore';
import { uploadBytesResumable,ref, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

//state,city,district,zip

export default function CreatePage({  }) {
    const [img, setImg] = useState(null);
    const [mail, setMail] = useState(null);
    const [password, setpassword] = useState(null);
    const [username, setusername] = useState(null);
    const [city, setCity] = useState(null);
    const [state, setState] = useState(null);
    const [district, setDistrict] = useState(null);
    const [zip, setZip] = useState(null);
    const router = useRouter();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
        }
    };

        const addUser = async () => {
            try {

                let imgurl = null;
                let user;

                if(!auth.currentUser.providerData.some((profile) => profile.providerId === "google.com")) {
                    const userCredentials = await createUserWithEmailAndPassword(auth, mail, password);
                    user = userCredentials.user;
                } else {
                    const credential = EmailAuthProvider.credential(auth.currentUser.email,password);
                    await linkWithCredential(auth.currentUser,credential);
                    user = auth.currentUser;
                }

                if(img) {
                    const uploadTask = uploadBytesResumable(ref(storage, `images/users/${user.uid}/profile`),img);

                    imgurl = await new Promise((res,rej) => {
                        uploadTask.on("state_changed", null, (error) => rej(error), () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(res);
                        });
                    });
                }

                await setDoc(doc(firestore,"users",user.uid), {
                    email: mail,
                    username: username,
                    address: [state,city,district,zip],
                    img: imgurl,
                    products: [],
                    product_no: 0
                });

                await updateProfile(user, {photoURL: imgurl,displayName: username});

                router.push("/marketplace");

            } catch(e) {
                if(e.code === 'auth/email-already-in-use') {
                    alert('Email in use.');
                } else if(e.code === 'auth/weak-password') {
                    alert('The password is weak.');
                } else {
                    console.log(e);
                }
            }
        };

    return (
        <div className="flex py-2 h-screen bg-[url('/login_bg_v.png')] md:bg-[url('/login_bg.png')] bg-cover bg-center justify-center items-center overflow-hidden">
            <div className="flex flex-col bg-white bg-opacity-90 rounded-lg shadow-lg p-6 space-y-4 md:w-[50%] h-full md:max-h-[95vh] overflow-auto">
                <p className="text-3xl text-center font-bold text-gray-800">Create Profile</p>
                <input 
                    type="file" 
                    id="filein" 
                    onChange={handleFileChange} 
                    className="hidden"
                />
                
                <div className="flex justify-center items-center mb-4">
                    {img ? (
                        <Image src={URL.createObjectURL(img)} width={170} height={170} className="rounded-full border-2 border-gray-300 shadow-md" />
                    ) : (
                        <div className="flex border-2 border-gray-300 rounded-full justify-center items-center bg-gray-100 h-[200px] w-[200px]">
                            <FcAddImage size={100} />
                        </div>
                    )}
                </div>
                
                <label 
                    className="bg-blue-500 text-white rounded-lg py-2 px-4 cursor-pointer text-center hover:bg-blue-600 transition-colors" 
                    htmlFor="filein"
                >
                    Add Image
                </label>

                <div className="flex items-center border-b-2 border-black py-2 px-3">
                    <MdMail className="text-xl text-black mr-3" />
                    <input 
                        type="text" 
                        name="email" 
                        className="flex-1 bg-transparent text-gray-800 px-2 focus:outline-none placeholder:text-gray-500" 
                        placeholder="Email"
                        onChange={(e) => {
                            if(e.target.value != "") {
                                setMail(e.target.value);
                            } else {
                                setMail(null);
                            }
                        }}
                    />
                </div>

                <div className="flex items-center border-b-2 border-black py-2 px-3">
                    <MdLock className="text-xl text-black mr-3" />
                    <input 
                        type="password" 
                        name="password" 
                        className="flex-1 bg-transparent text-gray-800 px-2 focus:outline-none placeholder:text-gray-500" 
                        placeholder="Password"
                        onChange={(e) => {
                            if(e.target.value != "") {
                                setpassword(e.target.value);
                            } else {
                                setpassword(null);
                            }
                        }}
                    />
                </div>

                <div className="flex items-center border-b-2 border-black py-2 px-3">
                    <FaUser className="text-xl text-black mr-3" />
                    <input 
                        type="text" 
                        name="username" 
                        className="flex-1 bg-transparent text-gray-800 px-2 focus:outline-none placeholder:text-gray-500" 
                        placeholder="Username"
                        onChange={(e) => {
                            if(e.target.value != "") {
                                setusername(e.target.value);
                            } else {
                                setusername(null);
                            }
                        }}
                    />
                </div>

                <hr className="border-black my-4"/>

                <div className="flex gap-2 text-xl font-bold">Address<FaHome size={25}/></div>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center border-b-2 border-black py-2 px-3">
                        <input 
                            type="text" 
                            name="city" 
                            className="flex-1 bg-transparent text-gray-800 px-2 focus:outline-none placeholder:text-gray-500" 
                            placeholder="City"
                            onChange={(e)=> {
                                if(e.target.value != "") {
                                    setCity(e.target.value);
                                } else {
                                    setCity(null);
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center border-b-2 border-black py-2 px-3">
                        <input 
                            type="text" 
                            name="district" 
                            className="flex-1 bg-transparent text-gray-800 px-2 focus:outline-none placeholder:text-gray-500" 
                            placeholder="District"
                            onChange={(e)=> {
                                if(e.target.value != "") {
                                    setDistrict(e.target.value);
                                } else {
                                    setDistrict(null);
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center border-b-2 border-black py-2 px-3">
                        <input 
                            type="text" 
                            name="state" 
                            className="flex-1 bg-transparent text-gray-800 px-2 focus:outline-none placeholder:text-gray-500" 
                            placeholder="State"
                            onChange={(e)=> {
                                if(e.target.value != "") {
                                    setState(e.target.value);
                                } else {
                                    setState(null);
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center border-b-2 border-black py-2 px-3">
                        <input 
                            type="text" 
                            name="zip-code" 
                            className="flex-1 bg-transparent text-gray-800 px-2 focus:outline-none placeholder:text-gray-500" 
                            placeholder="Zip Code"
                            onChange={(e)=> {
                                if(e.target.value != "") {
                                    setZip(e.target.value);
                                } else {
                                    setZip(null);
                                }
                            }}
                        />
                    </div>
                    <div className="bg-blue-500 text-white rounded-lg py-2 px-4 cursor-pointer text-center hover:bg-blue-600 transition-colors" onClick={() => {
                        if(mail && password && city && district && state && zip) {
                            addUser();
                        } else {
                            alert("Details are not filled");
                        }
                    }}>
                        Create Profile
                    </div>
                </div>
            </div>
        </div>
    );
}
