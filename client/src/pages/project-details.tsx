import { useParams, Link } from 'wouter';
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Target, MessageSquare, CheckCircle, Star, Code, Zap, TrendingUp, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/layout/footer';
import { projects } from '@/lib/constants';
import { useState } from 'react';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    // Navigate to home page and scroll to section
    window.location.href = `/#${sectionId}`;
    setIsMenuOpen(false);
  };

  const navItems = [
    { href: "services", label: "Services" },
    { href: "about", label: "About" },
    { href: "skills", label: "Skills" },
    { href: "projects", label: "Portfolio" },
    { href: "contact", label: "Contact" },
    { href: "/client/dashboard", label: "Client Portal" },
  ];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              window.location.href = '/#projects';
              setTimeout(() => {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header with Navigation */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-blue-600">Digital</span>
                <span className="text-2xl font-bold text-green-600"> Chidi</span>
                <span className="text-4xl font-bold text-blue-600 transform translate-x-[-8px] translate-y-[-4px]">
                  .
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    if (item.href === "/client/dashboard") {
                      window.location.href = item.href;
                    } else {
                      scrollToSection(item.href);
                    }
                  }}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Hire Me Button and Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                onClick={() => scrollToSection('booking')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm min-h-[40px] touch-manipulation"
                style={{ fontSize: '16px' }}
              >
                Hire Me
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      if (item.href === "/client/dashboard") {
                        window.location.href = item.href;
                      } else {
                        scrollToSection(item.href);
                      }
                    }}
                    className="block w-full text-left py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section with Enhanced CTA */}
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-blue-600 mb-4"
                onClick={() => {
                  window.location.href = '/#projects';
                  // Small delay to ensure navigation completes before scrolling
                  setTimeout(() => {
                    const projectsSection = document.getElementById('projects');
                    if (projectsSection) {
                      projectsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                {project.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {project.description}
              </p>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-blue-600 border-blue-600 text-sm py-1 px-2">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              {/* Mobile-Optimized Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 max-w-md">
                <Button 
                  onClick={() => scrollToSection('booking')}
                  className="w-auto bg-blue-600 hover:bg-blue-700 min-h-[48px] touch-manipulation px-8"
                  style={{ fontSize: '16px' }}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </div>
            </div>
            
            {/* Project Image */}
            <div className="order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <img
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Metrics */}
        {project.metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {project.metrics.map((metric, index) => (
              <Card key={metric.label} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                    {metric.value}
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Project Overview */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">About This Project</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Technologies Used</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.technologies.map((tech) => (
                      <div key={tech} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">Responsive design that works on all devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">Modern, clean user interface</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">Optimized for performance and SEO</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">Secure and scalable architecture</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Project Process */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  Development Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Planning & Design</h4>
                      <p className="text-gray-600">Comprehensive analysis of requirements and creation of user-centric design mockups.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Development</h4>
                      <p className="text-gray-600">Building the application with modern technologies and best practices.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Testing & Optimization</h4>
                      <p className="text-gray-600">Thorough testing and performance optimization for the best user experience.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Launch & Support</h4>
                      <p className="text-gray-600">Deployment and ongoing support to ensure everything runs smoothly.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
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
                    <div className="text-sm font-medium">Type</div>
                    <div className="text-sm text-gray-600">Web Application</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile-Optimized CTA Card */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Let's Work Together</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Inspired by this project? Let's discuss how I can help bring your ideas to life.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => scrollToSection('booking')}
                    className="w-full bg-blue-600 hover:bg-blue-700 min-h-[48px] touch-manipulation"
                    style={{ fontSize: '16px' }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Navigation to other projects */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Explore More Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start min-h-[48px] touch-manipulation"
                    style={{ fontSize: '16px' }}
                    onClick={() => {
                      window.location.href = '/#projects';
                      setTimeout(() => {
                        const projectsSection = document.getElementById('projects');
                        if (projectsSection) {
                          projectsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    View All Projects
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('services')}
                    variant="outline" 
                    className="w-full justify-start min-h-[48px] touch-manipulation"
                    style={{ fontSize: '16px' }}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    My Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Let's build something amazing together. Get in touch to discuss your ideas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection('booking')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 min-h-[52px] px-8 touch-manipulation"
              style={{ fontSize: '16px' }}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}