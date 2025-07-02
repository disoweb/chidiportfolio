
import { useParams, Link } from 'wouter';
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Target, MessageSquare, CheckCircle, Star, Code, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { projects } from '@/lib/constants';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);

  const scrollToSection = (sectionId: string) => {
    // Navigate to home page and scroll to section
    window.location.href = `/#${sectionId}`;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header with Navigation */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back Button + Project Title */}
            <div className="flex items-center space-x-4">
              <Link href="/#projects">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Portfolio</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs lg:max-w-md">
                  {project.title}
                </h1>
                <p className="text-sm text-gray-500">{project.category}</p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center space-x-3">
              {project.demo && (
                <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              <Button 
                onClick={() => scrollToSection('booking')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Start Similar Project</span>
                <span className="sm:hidden">Hire Me</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Enhanced CTA */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              {/* Mobile Title (hidden on desktop) */}
              <div className="md:hidden mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <p className="text-gray-600">{project.category}</p>
              </div>

              {/* Desktop Title */}
              <div className="hidden md:block">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{project.description}</p>
              </div>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="border-blue-200 text-blue-800 bg-blue-50">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {project.github && (
                  <Button asChild className="bg-gray-800 hover:bg-gray-900 flex-1 sm:flex-none">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Source Code
                    </a>
                  </Button>
                )}
                {project.demo && (
                  <Button asChild variant="outline" className="flex-1 sm:flex-none">
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Project Image */}
            <div className="order-first lg:order-last">
              <div className="relative group">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-auto rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Project Impact Metrics */}
        {project.metrics && (
          <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Project Impact & Results</h2>
                <p className="text-blue-100">Measurable outcomes and performance metrics</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {project.metrics.map((metric, index) => (
                  <div key={metric.label} className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      {index === 0 && <TrendingUp className="w-8 h-8 text-blue-200" />}
                      {index === 1 && <Zap className="w-8 h-8 text-blue-200" />}
                      {index === 2 && <Star className="w-8 h-8 text-blue-200" />}
                    </div>
                    <div className="text-4xl font-bold mb-2">
                      {metric.value}
                    </div>
                    <div className="text-blue-100 font-medium">{metric.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strategic CTA Section */}
        <div className="mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-l-blue-600">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Need a Similar Solution for Your Business?
                </h3>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  I can build a custom solution like this one, tailored specifically to your business needs and requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => scrollToSection('booking')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Schedule Free Consultation
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('contact')}
                    variant="outline" 
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl"
                  >
                    Get Custom Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-600">
                  <p className="leading-relaxed mb-4">
                    This project demonstrates advanced full-stack development capabilities, 
                    showcasing modern web technologies and best practices in software engineering.
                    The solution was carefully architected to address specific business challenges
                    while maintaining scalability and performance.
                  </p>
                  <p className="leading-relaxed mb-4">
                    The solution was architected with scalability, performance, and user experience 
                    as primary considerations, resulting in a robust application that meets both 
                    technical and business requirements. Every component was designed with 
                    maintainability and future growth in mind.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Code className="w-6 h-6 text-purple-600" />
                  </div>
                  Technical Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Frontend Architecture</h3>
                    <p className="text-gray-600">
                      Built with modern React patterns, TypeScript for type safety, and responsive 
                      design principles to ensure optimal user experience across all devices.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Backend Infrastructure</h3>
                    <p className="text-gray-600">
                      Scalable server architecture with RESTful APIs, robust data validation, 
                      and secure authentication mechanisms.
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Performance Optimization</h3>
                    <p className="text-gray-600">
                      Implemented caching strategies, code splitting, and performance monitoring 
                      to ensure fast load times and smooth user interactions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional CTA within content */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-50 to-blue-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Impressed by This Project?
                </h3>
                <p className="text-gray-600 mb-6">
                  Let's discuss how I can create a similar solution for your business needs.
                </p>
                <Button 
                  onClick={() => scrollToSection('booking')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  Let's Talk About Your Project
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Duration</div>
                    <div className="text-sm text-gray-600">3 months</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Team Size</div>
                    <div className="text-sm text-gray-600">Solo Developer</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium">Category</div>
                    <div className="text-sm text-gray-600">{project.category}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Responsive Design',
                    'Real-time Updates',
                    'Secure Authentication',
                    'Database Integration',
                    'API Development',
                    'Performance Optimized'
                  ].map((feature, index) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Sidebar CTA */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">Ready to Start?</h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Let's build something amazing together
                </p>
                <Button 
                  onClick={() => scrollToSection('booking')}
                  className="bg-white text-blue-600 hover:bg-blue-50 w-full font-semibold"
                >
                  Book Consultation
                </Button>
              </CardContent>
            </Card>

            {/* Navigation to other projects */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Explore More Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/#projects">
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      View All Projects
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => scrollToSection('services')}
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    My Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
            <CardContent className="p-12 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Your Next Project?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                From concept to deployment, I'll help you create a solution that drives results and grows your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => scrollToSection('booking')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Your Project Today
                </Button>
                <Button 
                  onClick={() => scrollToSection('services')}
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  View My Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
