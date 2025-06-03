
import { Download, Award, Users, Code2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

export function About() {
  const { elementRef, isIntersecting } = useIntersectionObserver();

  return (
    <section 
      ref={elementRef}
      id="about" 
      className={`py-10 bg-white transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <div className="mb-8">
              <p className="text-blue-600 font-semibold text-lg mb-4 tracking-wide">ABOUT ME</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
                Strategic & <span className="text-blue-600">Innovative</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  I'm a passionate <strong>Fullstack Developer</strong> with over 7 years of experience 
                  building high-performance web applications that drive business growth. My expertise spans 
                  the entire development lifecycle, from concept and design to deployment and optimization.
                </p>
                <p>
                  With a strong foundation in <strong>frontend & backend techn</strong>, I turn ideas into digital reality backed by robust, scalable architectures. I specialize in modern web
                  frameworks with emphasis on strong security, performance, scalability and exceptional user experience.
                </p>
                <p>
                  My background in engineering gives me a unique perspective to problem-solving, innovation and <strong>out-of-the-box</strong> thinking
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-semibold"
              >
                View Portfolio
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">7+</div>
                <div className="text-sm text-green-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                <div className="text-sm text-green-600">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-sm text-green-600">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            {/* Main Image/Visual */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl">
              <div className="text-white space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Code2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">My Approach</h3>
                    <p className="text-blue-200">Quality-driven development</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Users className="w-6 h-6 text-blue-200" />
                      <h4 className="font-semibold">Client-Focused</h4>
                    </div>
                    <p className="text-sm text-blue-100">
                      Understanding business needs and translating them into technical solutions
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Award className="w-6 h-6 text-blue-200" />
                      <h4 className="font-semibold">Quality First</h4>
                    </div>
                    <p className="text-sm text-blue-100">
                      Clean, maintainable code with comprehensive testing and documentation
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Lightbulb className="w-6 h-6 text-blue-200" />
                      <h4 className="font-semibold">Innovation</h4>
                    </div>
                    <p className="text-sm text-blue-100">
                      Staying current with latest technologies and best practices
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-1 bg-white rounded-2xl shadow-xl p-4 border border-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Instant</div>
                <div className="text-xs text-gray-600">Response Time</div>
              </div>
            </div>

            <div className="absolute -bottom-12 -left-1 bg-white rounded-2xl shadow-xl p-4 border border-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.99%</div>
                <div className="text-xs text-gray-600">Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
