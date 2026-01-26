"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (userName === "" || email === "" || password === "" || confirmPassword === "") {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");//testing 
      
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          options: {
            data: {
              userName: userName,
            },
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Please check your email for confirmation.");
        router.push("/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/home_bg1.png')] bg-cover bg-center flex items-center justify-center relative p-5">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

      {/* Signup Form */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-gray-800 bg-opacity-90 p-8 rounded-2xl shadow-lg"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo_white.png" alt="Lessa Logo" width={96} height={48} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Your Account
        </h2>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: "#facc15" }}
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: "#facc15" }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: "#facc15" }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: "#facc15" }}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Links */}
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}