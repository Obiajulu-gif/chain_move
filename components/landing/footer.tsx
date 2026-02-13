"use client"
import {
  Search,
  UserCheck,
  Rocket,
  HelpCircle,
  Phone,
  FileText,
  Shield,
  AlertTriangle,
  Mail,
  Twitter,
  Linkedin,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image src="/images/chainmovelogo.png" alt="ChainMove Logo" width={32} height={32} className="mr-3" />
              <span className="text-2xl font-bold text-[#E57700]">ChainMove</span>
            </div>
            <p className="text-gray-400 flex items-center">
              <Rocket className="h-4 w-4 mr-2" />
              Decentralized vehicle financing powered by blockchain technology.
            </p>
            <div className="flex space-x-4 mt-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#E57700] transition-colors cursor-pointer">
                <Mail className="h-4 w-4" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#E57700] transition-colors cursor-pointer">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#E57700] transition-colors cursor-pointer">
                <Linkedin className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Platform
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors flex items-center">
                  <Search className="h-3 w-3 mr-2" />
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center">
                  <UserCheck className="h-3 w-3 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-white transition-colors flex items-center">
                  <Rocket className="h-3 w-3 mr-2" />
                  Announcements
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              Support
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center">
                  <HelpCircle className="h-3 w-3 mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center">
                  <Phone className="h-3 w-3 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center">
                  <FileText className="h-3 w-3 mr-2" />
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Legal
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center">
                  <Shield className="h-3 w-3 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center">
                  <FileText className="h-3 w-3 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-2" />
                  Risk Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center">
            © 2025 ChainMove. All rights reserved.
            <Zap className="h-4 w-4 mx-2" />
            Built on Lisk Layer 2.
          </p>
        </div>
      </div>
    </footer>
  )
}
