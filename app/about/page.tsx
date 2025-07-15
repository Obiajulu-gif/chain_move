import { Navigation } from "@/components/landing/navigation";
import {
	PageHeader,
	MissionSection,
	ValuesSection,
	TimelineSection,
	CTASection,
	// TeamSection, // Uncomment when needed
} from "@/components/about";

export default function AboutPage() {
<<<<<<< Updated upstream
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<Navigation />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Header */}
				<PageHeader />

				{/* Mission Section */}
				<MissionSection />

				{/* Values Section */}
				<ValuesSection />

				{/* Team Section - Uncomment when needed */}
				{/* <TeamSection /> */}

				{/* Timeline Section */}
				<TimelineSection />

				{/* CTA Section */}
				<CTASection />
			</div>
		</div>
	);
=======
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-[#E57700] mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">About ChainMove</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            We're revolutionizing vehicle financing through blockchain technology, creating opportunities for drivers
            and investors worldwide.
          </p>
        </div>

        {/* Mission Section */}
        <section className="py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission 🎯</h2>
              <p className="text-lg text-muted-foreground mb-6">
                ChainMove exists to democratize access to vehicle financing by connecting drivers who need vehicles with
                investors seeking real-world asset returns. We leverage blockchain technology to create transparent,
                efficient, and inclusive financial solutions.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform eliminates traditional banking barriers, using alternative credit scoring and smart
                contracts to serve underbanked communities while providing investors with attractive, asset-backed
                returns.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-[#E57700] mb-2">$45M+</div>
                  <div className="text-muted-foreground">Total Funded</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#E57700] mb-2">2,847</div>
                  <div className="text-muted-foreground">Vehicles Financed</div>
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

        {/* Values Section */}
        <section className="py-16 bg-muted/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values 💎</h2>
            <p className="text-lg text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-2 hover:border-[#E57700] transition-colors bg-card">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#E57700] rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-card-foreground">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-muted/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey 📅</h2>
            <p className="text-lg text-muted-foreground">Key milestones in ChainMove's growth</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E57700]"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#E57700] rounded-full flex items-center justify-center relative z-10">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-6">
                      <div className="flex items-center mb-2">
                        <Badge className="bg-foreground text-background mr-3">{milestone.year}</Badge>
                        <h3 className="text-lg font-semibold text-foreground">{milestone.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Join the Revolution 🚀</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the future of vehicle financing. Whether you're a driver seeking financing or an investor looking
            for returns, ChainMove has opportunities for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#E57700] hover:bg-[#E57700]/90" asChild>
              <Link href="/auth?role=driver">
                Apply for Financing <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth?role=investor">
                Start Investing <Target className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
>>>>>>> Stashed changes
}
