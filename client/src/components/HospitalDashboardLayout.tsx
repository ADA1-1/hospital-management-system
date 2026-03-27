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
  { label: "Dashboard", href: "/dashboard", icon: <Home className="w-5 h-5" />, roles: ["admin", "doctor", "receptionist"] },
  { label: "Patients", href: "/patients", icon: <Users className="w-5 h-5" />, roles: ["admin", "receptionist", "doctor"] },
  { label: "Doctors", href: "/doctors", icon: <Stethoscope className="w-5 h-5" />, roles: ["admin", "receptionist"] },
  { label: "Appointments", href: "/appointments", icon: <Calendar className="w-5 h-5" />, roles: ["admin", "receptionist", "doctor"] },
  { label: "Medical Records", href: "/medical-records", icon: <FileText className="w-5 h-5" />, roles: ["admin", "doctor"] },
  { label: "Billing", href: "/billing", icon: <CreditCard className="w-5 h-5" />, roles: ["admin", "receptionist"] },
  { label: "Analytics", href: "/analytics", icon: <BarChart3 className="w-5 h-5" />, roles: ["admin"] },
];

export default function HospitalDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480390382/QD8CxmkBoXQQrVCLP9dFZA/pasted_file_SsxR3a_WhatsAppImage2026-03-27at10.25.01_d1264090.jpeg"
                alt="ADASIT Hospital"
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
              />
              <h1 className="text-lg font-bold text-cyan-600">ADASIT</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = location === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-lg"
                    : "text-foreground hover:bg-background"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-border space-y-3">
          {sidebarOpen && (
            <div className="px-4 py-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-semibold text-foreground truncate">{user.name || user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">ADASIT HOSPITAL</h2>
            <p className="text-sm text-muted-foreground">Welcome back, {user.name || "User"}</p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">
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
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-background transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline">{user.name || "User"}</span>
              </button>
              
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
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
          <div className="p-8">{children}</div>
          
          {/* Footer */}
          <footer className="bg-card border-t border-border mt-8 px-8 py-6 text-center text-muted-foreground text-sm">
            <p>&copy; 2026 ADASIT Hospital. All rights reserved.</p>
            <p className="mt-2 text-cyan-600 font-medium">Powered by GIVTECH COMPANY</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
