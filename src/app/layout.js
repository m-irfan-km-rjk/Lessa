"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/context/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "600", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Lessa</title>
      </head>
      <body className={`${inter.className} bg-white text-gray-800`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}