import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

export default function Analytics() {
  const { user } = useAuth();
  
  // Fetch data from existing procedures
  const { data: patients } = trpc.patient.getAll.useQuery();
  const { data: doctors } = trpc.doctor.getAll.useQuery();
  const { data: appointments } = trpc.appointment.getByDateRange.useQuery({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(),
  });
  const { data: bills } = trpc.bill.getByStatus.useQuery({ status: "pending" });

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPatients = patients?.length || 0;
    const totalDoctors = doctors?.length || 0;
    const totalAppointments = appointments?.length || 0;
    const totalRevenue = bills?.reduce((sum: number, bill: any) => {
      const amount = typeof bill.totalAmount === "string" ? parseFloat(bill.totalAmount) : bill.totalAmount || 0;
      return sum + amount;
    }, 0) || 0;
    const completedAppointments = appointments?.filter((apt: any) => apt.status === "completed").length || 0;
    const pendingAppointments = appointments?.filter((apt: any) => apt.status === "scheduled").length || 0;

    return {
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue,
      completedAppointments,
      pendingAppointments,
    };
  }, [patients, doctors, appointments, bills]);

  // Calculate appointment trends by status
  const appointmentTrends = useMemo(() => {
    if (!appointments) return [];
    const statusCounts: Record<string, number> = {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };
    appointments.forEach((apt: any) => {
      const status = apt.status || "scheduled";
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts]++;
      }
    });
    return [
      { name: "Scheduled", value: statusCounts.scheduled },
      { name: "Completed", value: statusCounts.completed },
      { name: "Cancelled", value: statusCounts.cancelled },
    ];
  }, [appointments]);

  // Calculate billing stats
  const billingStats = useMemo(() => {
    if (!bills) return [];
    const statusCounts: Record<string, number> = {};
    bills.forEach((bill: any) => {
      const status = bill.paymentStatus || "pending";
      const amount = typeof bill.totalAmount === "number" ? bill.totalAmount : 0;
      statusCounts[status] = (statusCounts[status] || 0) + amount;
    });
    return Object.entries(statusCounts).map(([status, amount]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      amount: typeof amount === "number" ? parseFloat(amount.toFixed(2)) : 0,
    }));
  }, [bills]);

  // Calculate patient distribution by gender
  const patientDistribution = useMemo(() => {
    if (!patients) return [];
    const genderCounts: Record<string, number> = {};
    patients.forEach((patient: any) => {
      const gender = patient.gender || "unknown";
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });
    return Object.entries(genderCounts).map(([gender, count]: [string, number]) => ({
      name: gender.charAt(0).toUpperCase() + gender.slice(1),
      value: count,
    }));
  }, [patients]);

  const COLORS = ["#06b6d4", "#f97316", "#8b5cf6", "#10b981"];

  if (!user) {
    return null;
  }

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600">Hospital performance metrics and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-cyan-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.totalPatients}</div>
              <p className="text-xs text-slate-500 mt-1">Active patients</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalDoctors}</div>
              <p className="text-xs text-slate-500 mt-1">Registered doctors</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalAppointments}</div>
              <p className="text-xs text-slate-500 mt-1">Total appointments</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Total revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Completed Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completedAppointments}</div>
              <p className="text-xs text-slate-500 mt-1">Finished consultations</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Pending Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</div>
              <p className="text-xs text-slate-500 mt-1">Scheduled appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Status Distribution */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Appointment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentTrends}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentTrends.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  No appointment data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Distribution by Gender */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Patient Distribution by Gender</CardTitle>
            </CardHeader>
            <CardContent>
              {patientDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={patientDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {patientDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  No patient data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Stats */}
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader>
              <CardTitle>Billing Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {billingStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={billingStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#f97316" name="Amount ($)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  No billing data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </HospitalDashboardLayout>
  );
}
