import { useState } from "react";
import { Menu, X, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDropdown } from "@/components/auth/auth-dropdown";
import { AuthModal } from "@/components/auth/auth-modal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const scrollToSection = (id: string) => {
    // Handle navigation to client portal
    if (id === "/client/dashboard") {
      window.location.href = "/client/dashboard";
      setIsOpen(false);
      return;
    }
    
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const navItems = [
    { href: "services", label: "Services" },
    { href: "about", label: "About" },
    { href: "skills", label: "Skills" },
    { href: "projects", label: "Portfolio" },
    { href: "contact", label: "Contact" },
  ];

  const handleLoginClick = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthModalTab("register");
    setIsAuthModalOpen(true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">Digital</span>
            <span className="text-2xl font-bold text-green-600"> Chidi</span>
            <span className="text-4xl font-bold text-blue-600 transform translate-x-[-8px] translate-y-[-4px]">
              .
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            <AuthDropdown 
              onLoginClick={handleLoginClick}
              onRegisterClick={handleRegisterClick}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={() => scrollToSection("booking")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Book Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              onClick={() => scrollToSection("booking")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
            >
              Hire Me
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-blue-600 font-medium text-left"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <AuthDropdown 
                  onLoginClick={handleLoginClick}
                  onRegisterClick={handleRegisterClick}
                />
              </div>
              <Button
                onClick={() => scrollToSection("booking")}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4"
              >
                Book Private Consultation
              </Button>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultTab={authModalTab}
        />
      </div>
    </nav>
  );
}