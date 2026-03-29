import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Activity, Users, Calendar, FileText, DollarSign, Shield } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-orange-50">
        {/* Header */}
        <div className="border-b border-cyan-300/40 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480390382/QD8CxmkBoXQQrVCLP9dFZA/pasted_file_SsxR3a_WhatsAppImage2026-03-27at10.25.01_d1264090.jpeg"
                alt="ADASIT Hospital"
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
              />
              <h1 className="text-2xl font-bold text-cyan-900">ADASIT HOSPITAL</h1>
            </div>
            <div className="text-sm text-cyan-700">
              Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Dashboard</h2>
            <p className="text-cyan-300 text-lg">Manage your hospital operations efficiently</p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Patients */}
            <div
              onClick={() => setLocation("/patients")}
              className="bg-gradient-to-br from-white to-cyan-50 border border-cyan-300 rounded-lg p-6 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-400/30 transition-all cursor-pointer group"
            >
              <Users className="w-12 h-12 text-cyan-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-cyan-900 mb-2">Patients</h3>
              <p className="text-slate-600 mb-4">Manage patient records, registration, and medical history</p>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                Go to Patients
              </Button>
            </div>

            {/* Doctors */}
            <div
              onClick={() => setLocation("/doctors")}
              className="bg-gradient-to-br from-white to-orange-50 border border-orange-300 rounded-lg p-6 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-400/30 transition-all cursor-pointer group"
            >
              <Shield className="w-12 h-12 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-orange-900 mb-2">Doctors</h3>
              <p className="text-slate-600 mb-4">Add and manage doctors with specializations</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Go to Doctors
              </Button>
            </div>

            {/* Appointments */}
            <div
              onClick={() => setLocation("/appointments")}
              className="bg-gradient-to-br from-white to-green-50 border border-green-300 rounded-lg p-6 hover:border-green-500 hover:shadow-lg hover:shadow-green-400/30 transition-all cursor-pointer group"
            >
              <Calendar className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-green-900 mb-2">Appointments</h3>
              <p className="text-slate-600 mb-4">Schedule and manage patient appointments</p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Go to Appointments
              </Button>
            </div>

            {/* Medical Records */}
            <div
              onClick={() => setLocation("/medical-records")}
              className="bg-gradient-to-br from-white to-blue-50 border border-blue-300 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-400/30 transition-all cursor-pointer group"
            >
              <FileText className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-blue-900 mb-2">Medical Records</h3>
              <p className="text-slate-600 mb-4">Record diagnoses, treatments, and prescriptions</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Go to Records
              </Button>
            </div>

            {/* Billing */}
            <div
              onClick={() => setLocation("/billing")}
              className="bg-gradient-to-br from-white to-purple-50 border border-purple-300 rounded-lg p-6 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-400/30 transition-all cursor-pointer group"
            >
              <DollarSign className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-purple-900 mb-2">Billing</h3>
              <p className="text-slate-600 mb-4">Generate bills and track payment status</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Go to Billing
              </Button>
            </div>

            {/* Dashboard */}
            <div
              onClick={() => setLocation("/dashboard")}
              className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-300 rounded-lg p-6 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-400/30 transition-all cursor-pointer group"
            >
              <Activity className="w-12 h-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Dashboard</h3>
              <p className="text-slate-600 mb-4">View role-based metrics and quick actions</p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show login page with public layout
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center px-4 py-16 relative min-h-screen bg-gradient-to-br from-red-500 via-green-500 to-sky-500">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-400/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-sky-400/30 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl bg-white/95 backdrop-blur-md p-12 rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-8">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480390382/QD8CxmkBoXQQrVCLP9dFZA/pasted_file_SsxR3a_WhatsAppImage2026-03-27at10.25.01_d1264090.jpeg"
              alt="ADASIT Hospital"
              className="w-32 h-32 rounded-lg object-cover border-4 border-red-500 shadow-lg shadow-red-500/50 animate-pulse"
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-sky-600 bg-clip-text text-transparent mb-4 tracking-tight">
            ADASIT HOSPITAL
          </h1>

          <p className="text-xl text-gray-700 mb-8 leading-relaxed font-semibold">
            Advanced Digital Healthcare Management System
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-gradient-to-r from-red-600 via-green-600 to-sky-600 hover:from-red-700 hover:via-green-700 hover:to-sky-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg shadow-red-600/40 transition-all"
            >
              Sign In with Manus
            </Button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left p-4 rounded-lg bg-red-50/80">
              <Users className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Patient Management</h3>
              <p className="text-gray-700">Complete patient records with medical history</p>
            </div>
            <div className="text-left p-4 rounded-lg bg-green-50/80">
              <Calendar className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">Appointments</h3>
              <p className="text-gray-700">Schedule and manage appointments efficiently</p>
            </div>
            <div className="text-left p-4 rounded-lg bg-sky-50/80">
              <DollarSign className="w-8 h-8 text-sky-600 mb-3" />
              <h3 className="text-lg font-semibold text-sky-900 mb-2">Billing</h3>
              <p className="text-gray-700">Generate bills and track payments</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
