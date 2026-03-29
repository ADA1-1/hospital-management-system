import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Calendar, Clock, User, Stethoscope } from "lucide-react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import AdminOnly from "@/components/AdminOnly";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Appointments() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    notes: "",
  });

  const appointmentsQuery = trpc.appointment.getByDateRange.useQuery({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  });
  const patientsQuery = trpc.patient.getAll.useQuery();
  const doctorsQuery = trpc.doctor.getAll.useQuery();
  const createMutation = trpc.appointment.create.useMutation();
  const updateMutation = trpc.appointment.update.useMutation();

  const appointments = appointmentsQuery.data || [];
  const patients = patientsQuery.data || [];
  const doctors = doctorsQuery.data || [];

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      notes: "",
    });
  };

  const handleAddAppointment = async () => {
    if (!formData.patientId || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        appointmentDate: new Date(formData.appointmentDate),
        appointmentTime: formData.appointmentTime,
        reason: formData.reason || undefined,
        notes: formData.notes || undefined,
      });
      toast.success("Appointment scheduled successfully");
      resetForm();
      setIsAddOpen(false);
      appointmentsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule appointment");
    }
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({
        id: appointmentId,
        status: newStatus as any,
      });
      toast.success("Appointment status updated");
      appointmentsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update appointment");
    }
  };

  const getPatientName = (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
  };

  const getDoctorName = (doctorId: number) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown";
  };

  const filteredAppointments = appointments.filter((apt: any) => {
    if (filterStatus !== "all" && apt.status !== filterStatus) return false;
    if (searchQuery) {
      const patientName = getPatientName(apt.patientId).toLowerCase();
      const doctorName = getDoctorName(apt.doctorId).toLowerCase();
      return patientName.includes(searchQuery.toLowerCase()) || doctorName.includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "scheduled":
        return "badge badge-info";
      case "completed":
        return "badge badge-success";
      case "cancelled":
        return "badge badge-danger";
      default:
        return "badge badge-warning";
    }
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">Appointment Management</h1>
            <p className="text-muted-foreground mt-1">Schedule and manage patient appointments</p>
          </div>
          {user?.role !== "doctor" && (
            <Button className="btn-primary" onClick={() => { resetForm(); setIsAddOpen(!isAddOpen); }}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          )}
        </div>

        {/* Add Appointment Form */}
        {isAddOpen && user?.role !== "doctor" && (
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-cyan-400">Schedule New Appointment</h2>
              <button
                onClick={() => { resetForm(); setIsAddOpen(false); }}
                className="p-2 hover:bg-background rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Patient *</label>
                <select
                  className="form-input"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Doctor *</label>
                <select
                  className="form-input"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Appointment Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Appointment Time *</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Reason for Visit</label>
                <textarea
                  placeholder="Reason for appointment"
                  className="form-input"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Notes</label>
                <textarea
                  placeholder="Additional notes"
                  className="form-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => { resetForm(); setIsAddOpen(false); }}>
                Cancel
              </Button>
              <Button className="btn-primary" onClick={handleAddAppointment}>
                Schedule Appointment
              </Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by patient or doctor name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="form-input w-40"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Appointments List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredAppointments.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery ? "No appointments found matching your search" : "No appointments scheduled"}
              </p>
            </Card>
          ) : (
            filteredAppointments.map((appointment: any) => (
              <Card key={appointment.id} className="p-6 hover:border-accent transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm text-muted-foreground">Patient</span>
                    </div>
                    <p className="font-semibold text-foreground">{getPatientName(appointment.patientId)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Stethoscope className="w-5 h-5 text-orange-400" />
                      <span className="text-sm text-muted-foreground">Doctor</span>
                    </div>
                    <p className="font-semibold text-foreground">{getDoctorName(appointment.doctorId)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-muted-foreground">Date</span>
                    </div>
                    <p className="font-semibold text-foreground">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-muted-foreground">Time</span>
                    </div>
                    <p className="font-semibold text-foreground">{appointment.appointmentTime}</p>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Reason</p>
                    <p className="text-foreground">{appointment.reason}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className={getStatusBadgeClass(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  {user?.role === "receptionist" && appointment.status === "scheduled" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment.id, "completed")}
                      >
                        Mark Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </HospitalDashboardLayout>
  );
}
