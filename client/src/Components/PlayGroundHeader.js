import { useContext } from "react"
import { ThemeContext } from "../contexts/ThemeContext"

export default function PlayGroundHeader() {
  const {theme,settheme}=useContext(ThemeContext);
  const DarkMode=theme==='dark';

  return (
    <header className={` border-b-2 h-16${DarkMode?'bg-black text-white border-white': 'bg-white text-black border-black'} `}>
      <nav className="flex items-center justify-between p-4" aria-label="Global">
        
        {/* Logo */}
        <div className="pl-2 flex items-center">
          <a href="/home" className="-m-1.5 p-1.5 flex items-center gap-2">
            {/* <img
              className="h-6 w-6"
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Flowbite Logo"
            /> */}
            <span className="font-bold text-2xl">Flowbite</span>
          </a>
        </div>

     
        {/* Desktop Navigation Links */}
        {/* <PopoverGroup className="lg:flex lg:gap-x-8">
          <a href="#" className="text-sm font-semibold text-white hover:text-blue-500">Home</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Company</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Marketplace</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Features</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Team</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Contact</a>
        </PopoverGroup> */}

        {/* Buttons */}
        <div className={`flex items-center pl-4 gap-2 pr-0`}>
          
          <a
            href="/login"
            className={`text-white font-medium text-sm px-4 py-2 ${DarkMode?'bg-blue-600 hover:bg-blue-700':'bg-black hover:bg-gray-700'}`}
          >
            Login
          </a>
        </div>
        </nav>
    </header>
  )
}
