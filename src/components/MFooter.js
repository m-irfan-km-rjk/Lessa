import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export function MFooter() {
  return (
    <footer className="bg-gray-900 text-white p-10 mt-auto shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo / Brand */}
        <div className="text-2xl font-bold">LESSA</div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-6 text-gray-300 justify-center md:justify-start">
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
          <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition">Terms of Service</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition">
            <FaFacebookF />
          </a>
          <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-sky-400 transition">
            <FaTwitter />
          </a>
          <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-pink-500 transition">
            <FaInstagram />
          </a>
          <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-blue-700 transition">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
}
