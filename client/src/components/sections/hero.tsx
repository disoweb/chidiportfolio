import {
  ArrowRight,
  Code,
  Globe,
  Zap,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Hi, My Name is Chidi
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="block">Fullstack</span>
                <span className="block text-blue-600">Web Developer</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                I build high-performance web applications that drive business
                growth. From concept to deployment, I deliver scalable solutions
                using modern technologies.
              </p>
            </div>
            <div className="inline-flex items-center bg-emerald-100/80 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-emerald-200/50">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
              Available for New Projects
            </div>
<div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-center lg:justify-start mb-12">
  <Button
    onClick={() => scrollToSection("booking")}
    className="!w-fit inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
  >
    <Calendar className="w-5 h-5 mr-2" />
    Book Free Consultation
  </Button>
  <Button
    onClick={() => scrollToSection("services")}
    variant="outline"
    className="!w-fit inline-flex items-center border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-300"
  >
    <Globe className="w-5 h-5 mr-2" />
    View Services
  </Button>
</div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                7+ Years Experience
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                100+ Projects Delivered
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                98% Client Satisfaction
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/90 rounded-3xl"></div>
              <div className="relative text-white">
                <div className="mb-6">
                  <Code className="w-12 h-12 text-blue-200 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Digital Chidi</h3>
                  <p className="text-blue-200">Fullstack Developer</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Frontend Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "TypeScript",
                        "Next.js",
                        "boostrap",
                        "html5",
                        "Tailwind",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="bg-white/20 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Backend Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Node.js",
                        "MySQL",
                        "Laravel",
                        "PHP",
                        "Express.js",
                        "PostgreSQL",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="bg-white/20 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Portals", "SaaS", "Portfolios", "Custom Apps"].map(
                        (spec) => (
                          <span
                            key={spec}
                            className="bg-white/20 px-2 py-1 rounded text-xs"
                          >
                            {spec}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-10 -right-1 bg-white rounded-2xl shadow-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Result Oriented
                  </div>
                  <div className="text-sm text-gray-600">Growth Mindset</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 border border-gray-200 min-w-[240px]">
              <div className="flex flex-col gap-3 items-center">
                {/* Fast Delivery - Horizontal Layout */}
                <div className="flex items-center gap-3 w-full">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      Fast Delivery
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      Agile development
                    </div>
                  </div>
                </div>

                {/* Quality Assurance - Auto Width */}
                <div className="inline-flex items-center bg-emerald-100/80 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200/50">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">Quality Assurance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
