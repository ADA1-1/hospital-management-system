import { useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-orange-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-cyan-200/40 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480390382/QD8CxmkBoXQQrVCLP9dFZA/pasted_file_SsxR3a_WhatsAppImage2026-03-27at10.25.01_d1264090.jpeg"
              alt="ADASIT Hospital"
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
            />
            <h1 className="text-2xl font-bold text-cyan-900">ADASIT HOSPITAL</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-cyan-600 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Login Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="hidden sm:flex bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors z-50"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu - Fixed Positioning */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-white border-b-2 border-cyan-400 px-4 py-6 space-y-4 z-50 shadow-xl max-h-96 overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-slate-800 font-semibold hover:bg-cyan-100 hover:text-cyan-900 rounded-lg transition-all bg-slate-50 border-l-4 border-cyan-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white gap-2 py-3 font-semibold"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-cyan-400">ADASIT HOSPITAL</h3>
              <p className="text-slate-300 text-sm">
                Advanced Digital Healthcare Management System providing comprehensive hospital management solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <a href="/" className="hover:text-cyan-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-cyan-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-cyan-400 transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-cyan-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Patient Management</li>
                <li>Appointment Scheduling</li>
                <li>Medical Records</li>
                <li>Billing System</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Email: info@adasithospital.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Medical Center Drive</li>
                <li>City, State 12345</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 ADASIT Hospital. All rights reserved.</p>
            <p className="mt-2 text-cyan-400">Powered by GIVTECH COMPANY</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
