import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, useRoute } from "wouter";
import { Menu, X, LogOut, Home, Users, Stethoscope, Calendar, FileText, CreditCard, BarChart3, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <Home className="w-5 h-5" />, roles: ["admin", "doctor", "receptionist", "user", "patient", "stakeholder"] },
  { label: "Patients", href: "/patients", icon: <Users className="w-5 h-5" />, roles: ["admin", "receptionist", "doctor", "user", "patient", "stakeholder"] },
  { label: "Doctors", href: "/doctors", icon: <Stethoscope className="w-5 h-5" />, roles: ["admin", "receptionist", "user", "patient", "stakeholder"] },
  { label: "Appointments", href: "/appointments", icon: <Calendar className="w-5 h-5" />, roles: ["admin", "receptionist", "doctor", "user", "patient", "stakeholder"] },
  { label: "Medical Records", href: "/medical-records", icon: <FileText className="w-5 h-5" />, roles: ["admin", "doctor", "user", "patient", "stakeholder"] },
  { label: "Billing", href: "/billing", icon: <CreditCard className="w-5 h-5" />, roles: ["admin", "receptionist", "user", "patient", "stakeholder"] },
  { label: "Analytics", href: "/analytics", icon: <BarChart3 className="w-5 h-5" />, roles: ["admin", "doctor", "receptionist", "user", "patient", "stakeholder"] },
];

export default function HospitalDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Always keep sidebar open
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden sm:flex w-64 md:w-72 lg:w-80 xl:w-96 bg-card border-r border-border flex-col shadow-lg">
        {/* Header */}
        <div className="p-2 sm:p-3 md:p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480390382/QD8CxmkBoXQQrVCLP9dFZA/pasted_file_SsxR3a_WhatsAppImage2026-03-27at10.25.01_d1264090.jpeg"
              alt="ADASIT Hospital"
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover border-2 border-cyan-400"
            />
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-cyan-600">ADASIT</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = location === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-lg"
                    : "text-foreground hover:bg-background"
                }`}
              >
                <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5">{item.icon}</span>
                <span className="text-xs sm:text-sm font-medium hidden md:inline">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-2 sm:p-3 md:p-4 border-t border-border space-y-2 sm:space-y-3">
          <div className="px-2 sm:px-4 py-2 sm:py-3 bg-background rounded-lg">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{user.name || user.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-2 sm:px-4 py-2 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shadow-sm flex-wrap sm:flex-nowrap gap-2 sm:gap-0">
          <div className="w-full sm:w-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-400">ADASIT HOSPITAL</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Welcome back, {user.name || "User"}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 w-full sm:w-auto justify-end">
            <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 rounded-lg hover:bg-background transition-colors"
              >
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground hidden md:inline">{user.name || "User"}</span>
              </button>
              
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  <a
                    href="/profile"
                    onClick={() => {
                      setLocation("/profile");
                      setProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-background transition-colors border-b border-border"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">My Profile</span>
                  </a>
                  <a
                    href="/user-profile"
                    onClick={() => {
                      setLocation("/user-profile");
                      setProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-background transition-colors border-b border-border"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">{children}</div>
          
          {/* Footer */}
          <footer className="bg-card border-t border-border mt-6 sm:mt-8 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 text-center text-muted-foreground text-xs sm:text-sm">
            <p>&copy; 2026 ADASIT Hospital. All rights reserved.</p>
            <p className="mt-2 text-cyan-600 font-medium">Powered by GIVTECH COMPANY</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
