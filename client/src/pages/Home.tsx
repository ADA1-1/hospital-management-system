import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Activity, Users, Calendar, FileText, DollarSign, Shield } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-orange-900">
        {/* Header */}
        <div className="border-b border-cyan-500/20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">ADASIT HOSPITAL</h1>
            </div>
            <div className="text-sm text-cyan-300">
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
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer group"
            >
              <Users className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Patients</h3>
              <p className="text-slate-400 mb-4">Manage patient records, registration, and medical history</p>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                Go to Patients
              </Button>
            </div>

            {/* Doctors */}
            <div
              onClick={() => setLocation("/doctors")}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/30 rounded-lg p-6 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer group"
            >
              <Shield className="w-12 h-12 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Doctors</h3>
              <p className="text-slate-400 mb-4">Add and manage doctors with specializations</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Go to Doctors
              </Button>
            </div>

            {/* Appointments */}
            <div
              onClick={() => setLocation("/appointments")}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-green-500/30 rounded-lg p-6 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer group"
            >
              <Calendar className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Appointments</h3>
              <p className="text-slate-400 mb-4">Schedule and manage patient appointments</p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Go to Appointments
              </Button>
            </div>

            {/* Medical Records */}
            <div
              onClick={() => setLocation("/medical-records")}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/30 rounded-lg p-6 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer group"
            >
              <FileText className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Medical Records</h3>
              <p className="text-slate-400 mb-4">Record diagnoses, treatments, and prescriptions</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Go to Records
              </Button>
            </div>

            {/* Billing */}
            <div
              onClick={() => setLocation("/billing")}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-lg p-6 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer group"
            >
              <DollarSign className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Billing</h3>
              <p className="text-slate-400 mb-4">Generate bills and track payment status</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Go to Billing
              </Button>
            </div>

            {/* Dashboard */}
            <div
              onClick={() => setLocation("/dashboard")}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-500/30 rounded-lg p-6 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer group"
            >
              <Activity className="w-12 h-12 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Dashboard</h3>
              <p className="text-slate-400 mb-4">View role-based metrics and quick actions</p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show login page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-orange-900 flex flex-col items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        <div className="flex justify-center mb-8">
          <Activity className="w-16 h-16 text-cyan-400 animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          ADASIT HOSPITAL
        </h1>

        <p className="text-xl text-cyan-300 mb-8 leading-relaxed">
          Advanced Digital Healthcare Management System
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg shadow-cyan-500/50 transition-all"
          >
            Sign In with Manus
          </Button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-left">
            <Users className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Patient Management</h3>
            <p className="text-slate-400">Complete patient records with medical history</p>
          </div>
          <div className="text-left">
            <Calendar className="w-8 h-8 text-orange-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Appointments</h3>
            <p className="text-slate-400">Schedule and manage appointments efficiently</p>
          </div>
          <div className="text-left">
            <DollarSign className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Billing</h3>
            <p className="text-slate-400">Generate bills and track payments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
