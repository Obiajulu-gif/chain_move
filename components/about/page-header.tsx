import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function PageHeader() {
  return (
    <div className="mb-8">
      <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-[#E57700] dark:hover:text-[#FFD580] mb-4">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Home
      </Link>
      <h1 className="text-4xl font-bold text-[#142841] dark:text-white mb-4">About ChainMove</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
        We're revolutionizing vehicle financing through blockchain technology, creating opportunities for drivers
        and investors worldwide.
      </p>
    </div>
  )
}
