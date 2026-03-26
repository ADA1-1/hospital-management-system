import React, { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Stethoscope, Calendar, FileText, CreditCard, TrendingUp } from "lucide-react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data based on user role
  const patientsQuery = trpc.patient.getAll.useQuery();
  const doctorsQuery = trpc.doctor.getAll.useQuery();
  const appointmentsQuery = trpc.appointment.getByDateRange.useQuery({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  const billsQuery = trpc.bill.getByStatus.useQuery({ status: "pending" });

  useEffect(() => {
    if (patientsQuery.data || doctorsQuery.data || appointmentsQuery.data || billsQuery.data) {
      setLoading(false);

      const newStats: StatCard[] = [];

      if (user?.role === "admin") {
        newStats.push(
          {
            label: "Total Patients",
            value: patientsQuery.data?.length || 0,
            icon: <Users className="w-8 h-8 text-cyan-400" />,
            color: "cyan",
          },
          {
            label: "Total Doctors",
            value: doctorsQuery.data?.length || 0,
            icon: <Stethoscope className="w-8 h-8 text-orange-400" />,
            color: "orange",
          },
          {
            label: "Appointments (30d)",
            value: appointmentsQuery.data?.length || 0,
            icon: <Calendar className="w-8 h-8 text-green-400" />,
            color: "green",
          },
          {
            label: "Pending Bills",
            value: billsQuery.data?.length || 0,
            icon: <CreditCard className="w-8 h-8 text-red-400" />,
            color: "red",
          }
        );
      } else if (user?.role === "doctor") {
        newStats.push(
          {
            label: "My Patients",
            value: patientsQuery.data?.length || 0,
            icon: <Users className="w-8 h-8 text-cyan-400" />,
            color: "cyan",
          },
          {
            label: "Appointments",
            value: appointmentsQuery.data?.length || 0,
            icon: <Calendar className="w-8 h-8 text-green-400" />,
            color: "green",
          }
        );
      } else if (user?.role === "receptionist") {
        newStats.push(
          {
            label: "Total Patients",
            value: patientsQuery.data?.length || 0,
            icon: <Users className="w-8 h-8 text-cyan-400" />,
            color: "cyan",
          },
          {
            label: "Appointments",
            value: appointmentsQuery.data?.length || 0,
            icon: <Calendar className="w-8 h-8 text-green-400" />,
            color: "green",
          },
          {
            label: "Pending Bills",
            value: billsQuery.data?.length || 0,
            icon: <CreditCard className="w-8 h-8 text-red-400" />,
            color: "red",
          }
        );
      }

      setStats(newStats);
    }
  }, [patientsQuery.data, doctorsQuery.data, appointmentsQuery.data, billsQuery.data, user?.role]);

  return (
    <HospitalDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-cyan-900 to-orange-900 rounded-lg p-8 border border-cyan-500 border-opacity-30">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to HMS</h1>
          <p className="text-cyan-200">
            {user?.role === "admin"
              ? "Manage your hospital operations efficiently"
              : user?.role === "doctor"
              ? "Manage your patients and appointments"
              : "Handle patient registrations and appointments"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            stats.map((stat, idx) => (
              <Card key={idx} className="p-6 hover:border-accent transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className="ml-4">{stat.icon}</div>
                </div>
                <div className="h-1 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-full"></div>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user?.role === "admin" && (
              <>
                <Button className="btn-primary w-full justify-start" onClick={() => (window.location.href = "/patients")}>
                  <Users className="w-4 h-4 mr-2" />
                  Manage Patients
                </Button>
                <Button className="btn-secondary w-full justify-start" onClick={() => (window.location.href = "/doctors")}>
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Manage Doctors
                </Button>
                <Button className="btn-primary w-full justify-start" onClick={() => (window.location.href = "/appointments")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  View Appointments
                </Button>
              </>
            )}
            {user?.role === "receptionist" && (
              <>
                <Button className="btn-primary w-full justify-start" onClick={() => (window.location.href = "/patients")}>
                  <Users className="w-4 h-4 mr-2" />
                  Register Patient
                </Button>
                <Button className="btn-secondary w-full justify-start" onClick={() => (window.location.href = "/appointments")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button className="btn-primary w-full justify-start" onClick={() => (window.location.href = "/billing")}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  View Bills
                </Button>
              </>
            )}
            {user?.role === "doctor" && (
              <>
                <Button className="btn-primary w-full justify-start" onClick={() => (window.location.href = "/patients")}>
                  <Users className="w-4 h-4 mr-2" />
                  My Patients
                </Button>
                <Button className="btn-secondary w-full justify-start" onClick={() => (window.location.href = "/appointments")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  My Appointments
                </Button>
                <Button className="btn-primary w-full justify-start" onClick={() => (window.location.href = "/medical-records")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Medical Records
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg hover:border-accent border border-border transition-all">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-foreground">System initialized</p>
                <p className="text-sm text-muted-foreground">Welcome to Hospital Management System</p>
              </div>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </HospitalDashboardLayout>
  );
}
