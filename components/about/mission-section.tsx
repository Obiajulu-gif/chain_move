import Image from "next/image"

export function MissionSection() {
  return (
    <section className="py-16 bg-white dark:bg-[#18181B]">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#142841] dark:text-white mb-6">Our Mission 🎯</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            ChainMove exists to democratize access to vehicle financing by connecting drivers who need vehicles with
            investors seeking real-world asset returns. We leverage blockchain technology to create transparent,
            efficient, and inclusive financial solutions.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Our platform eliminates traditional banking barriers and Hire Purchase Model, using alternative credit scoring and smart
            contracts to serve underbanked communities while providing investors with attractive, asset-backed
            returns.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-2xl font-bold text-[#E57700] dark:text-[#FFD580] mb-2">$45M+</div>
              <div className="text-gray-600 dark:text-gray-300">Total Funded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#E57700] dark:text-[#FFD580] mb-2">2,847</div>
              <div className="text-gray-600 dark:text-gray-300">Vehicles Financed</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <Image
            src="/images/about-mission.jpg"
            alt="ChainMove mission"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
