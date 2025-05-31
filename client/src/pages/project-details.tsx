
import { useParams, Link } from 'wouter';
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { projects } from '@/lib/constants';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/#projects">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{project.description}</p>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="border-blue-200 text-blue-800">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {project.github && (
                  <Button asChild className="bg-gray-800 hover:bg-gray-900">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
                {project.demo && (
                  <Button asChild variant="outline">
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Project Image */}
            <div className="lg:w-1/2">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Project Metrics */}
        {project.metrics && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Project Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {metric.value}
                    </div>
                    <div className="text-gray-600">{metric.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    This project demonstrates advanced full-stack development capabilities, 
                    showcasing modern web technologies and best practices in software engineering.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    The solution was architected with scalability, performance, and user experience 
                    as primary considerations, resulting in a robust application that meets both 
                    technical and business requirements.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Technical Implementation</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Frontend Architecture</h3>
                    <p className="text-gray-600">
                      Built with modern React patterns, TypeScript for type safety, and responsive 
                      design principles to ensure optimal user experience across all devices.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Backend Infrastructure</h3>
                    <p className="text-gray-600">
                      Scalable server architecture with RESTful APIs, robust data validation, 
                      and secure authentication mechanisms.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Performance Optimization</h3>
                    <p className="text-gray-600">
                      Implemented caching strategies, code splitting, and performance monitoring 
                      to ensure fast load times and smooth user interactions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Project Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Duration</div>
                      <div className="text-sm text-gray-600">3 months</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Team Size</div>
                      <div className="text-sm text-gray-600">Solo Developer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Category</div>
                      <div className="text-sm text-gray-600">{project.category}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Responsive Design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Real-time Updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Secure Authentication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Database Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">API Development</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
