
import { useParams, Link } from 'wouter';
import { ArrowLeft, ExternalLink, Github, CheckCircle, TrendingUp, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { projects } from '@/lib/constants';

export default function CaseStudy() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Case Study Not Found</h1>
          <Link href="/#projects">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#projects">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl mb-6 text-blue-100">{project.description}</p>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="border-white text-white">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {project.github && (
                  <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
                {project.demo && (
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            <div>
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Project Metrics */}
        {project.metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {project.metrics.map((metric, index) => (
              <Card key={metric.label} className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {metric.value}
                  </div>
                  <div className="text-gray-600">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Case Study Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Challenge */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  The client needed a comprehensive solution that could handle complex business requirements 
                  while maintaining excellent user experience and performance standards.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Key challenges included scalability concerns, integration with existing systems, 
                  and the need for real-time functionality across multiple user roles.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Complex data relationships and workflow management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Real-time synchronization across multiple devices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Scalable architecture for future growth</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Solution */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Solution</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  I designed and developed a modern, scalable application using cutting-edge technologies 
                  and industry best practices. The solution prioritized performance, security, and user experience.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Frontend Excellence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Built with React and TypeScript for type safety, implementing responsive design 
                        and modern UI/UX patterns for optimal user experience.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Backend Architecture
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Robust server-side implementation with Node.js, featuring RESTful APIs, 
                        database optimization, and secure authentication systems.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Results */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Results & Impact</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  The implementation exceeded expectations, delivering significant improvements in efficiency, 
                  user satisfaction, and business metrics. The solution has proven to be scalable and maintainable.
                </p>
                
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Key Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-800">50% reduction in load times</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-800">98% uptime reliability</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-800">300% increase in user engagement</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-800">Zero security incidents</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Timeline</div>
                    <div className="text-sm text-gray-600">3 months</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Team</div>
                    <div className="text-sm text-gray-600">Solo Developer</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Industry</div>
                    <div className="text-sm text-gray-600">{project.category}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.technologies.map((tech) => (
                    <div key={tech} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Want to Learn More?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Interested in discussing how I can help with your next project?
                </p>
                <Link href="/#contact">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Get In Touch
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
