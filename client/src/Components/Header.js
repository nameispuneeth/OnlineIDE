import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate=useNavigate();
  return (
    <header className="bg-gray-900 text-white">
      <nav className="flex items-center justify-between p-4" aria-label="Global">
        
        {/* Logo */}
        <div className="pl-2 flex items-center">
          <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
            <img
              className="h-6 w-6"
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Flowbite Logo"
            />
            <span className="text-white font-semibold text-lg cursor-pointer" onClick={()=>navigate("/")}>Flowbite</span>
          </a>
        </div>

     
        {/* Desktop Navigation Links */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-8">
          <a href="#" className="text-sm font-semibold text-white hover:text-blue-500">Home</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Company</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Marketplace</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Features</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Team</a>
          <a href="#" className="text-sm font-semibold text-gray-400 hover:text-blue-500">Contact</a>
        </PopoverGroup>

        {/* Buttons */}
        <div className={`flex items-center pl-4 gap-2 pr-0`}>
          <a
            href="#"
            className="text-white hover:text-blue-500 font-medium text-sm px-4 py-2 rounded-md"
          >
            Log in
          </a>
          <a
            href="#"
            className="text-white bg-blue-600 hover:bg-blue-700 font-medium text-sm px-4 py-2 rounded-md"
          >
            Get started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="text-gray-400 hover:text-white p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

      </nav>

      {/* Mobile Menu */}
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-gray-900 p-6 text-white overflow-y-auto">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <img
                className="h-6 w-6"
                src="https://flowbite.com/docs/images/logo.svg"
                alt="Flowbite Logo"
              />
              <span className="font-semibold">Flowbite</span>
            </a>
            <button
              type="button"
              className="text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <a href="#" className="block text-sm font-semibold text-white hover:text-blue-500">Home</a>
            <a href="#" className="block text-sm font-semibold text-gray-400 hover:text-blue-500">Company</a>
            <a href="#" className="block text-sm font-semibold text-gray-400 hover:text-blue-500">Marketplace</a>
            <a href="#" className="block text-sm font-semibold text-gray-400 hover:text-blue-500">Features</a>
            <a href="#" className="block text-sm font-semibold text-gray-400 hover:text-blue-500">Team</a>
            <a href="#" className="block text-sm font-semibold text-gray-400 hover:text-blue-500">Contact</a>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
