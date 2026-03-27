import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, FileText } from "lucide-react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function MedicalRecords() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentId: "",
    visitDate: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    vitals: "",
  });

  const recordsQuery = trpc.medicalRecord.getByPatient.useQuery(
    { patientId: user?.id || 0 },
    { enabled: !!user?.id }
  );
  const patientsQuery = trpc.patient.getAll.useQuery();
  const doctorsQuery = trpc.doctor.getAll.useQuery();
  const createMutation = trpc.medicalRecord.create.useMutation();

  const records = recordsQuery.data || [];
  const patients = patientsQuery.data || [];
  const doctors = doctorsQuery.data || [];

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      appointmentId: "",
      visitDate: "",
      diagnosis: "",
      treatment: "",
      notes: "",
      vitals: "",
    });
  };

  const handleAddRecord = async () => {
    if (!formData.patientId || !formData.doctorId || !formData.visitDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        appointmentId: formData.appointmentId ? parseInt(formData.appointmentId) : undefined,
        visitDate: new Date(formData.visitDate),
        diagnosis: formData.diagnosis || undefined,
        treatment: formData.treatment || undefined,
        notes: formData.notes || undefined,
        vitals: formData.vitals || undefined,
      });
      toast.success("Medical record created successfully");
      resetForm();
      setIsAddOpen(false);
      recordsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to create medical record");
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

  const filteredRecords = (records || []).filter((record: any) => {
    if (searchQuery) {
      const patientName = getPatientName(record.patientId).toLowerCase();
      return patientName.includes(searchQuery.toLowerCase()) || 
             record.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">Medical Records</h1>
            <p className="text-muted-foreground mt-1">Manage patient medical history and treatment records</p>
          </div>
          {user?.role === "doctor" && (
            <Button className="btn-primary" onClick={() => { resetForm(); setIsAddOpen(!isAddOpen); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          )}
        </div>

        {/* Add Record Form */}
        {isAddOpen && user?.role === "doctor" && (
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-cyan-400">Create Medical Record</h2>
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
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Visit Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.visitDate}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Appointment ID (Optional)</label>
                <input
                  type="number"
                  placeholder="Appointment ID"
                  className="form-input"
                  value={formData.appointmentId}
                  onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Diagnosis</label>
                <textarea
                  placeholder="Patient diagnosis"
                  className="form-input"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Treatment</label>
                <textarea
                  placeholder="Treatment plan and medications"
                  className="form-input"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Vitals</label>
                <textarea
                  placeholder="Blood pressure, temperature, heart rate, etc."
                  className="form-input"
                  value={formData.vitals}
                  onChange={(e) => setFormData({ ...formData, vitals: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Additional Notes</label>
                <textarea
                  placeholder="Any additional notes"
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
              <Button className="btn-primary" onClick={handleAddRecord}>
                Create Record
              </Button>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or diagnosis..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredRecords.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery ? "No records found matching your search" : "No medical records found"}
              </p>
            </Card>
          ) : (
            filteredRecords.map((record: any) => (
              <Card key={record.id} className="p-6 hover:border-accent transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="font-semibold text-foreground">{getPatientName(record.patientId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-semibold text-foreground">{getDoctorName(record.doctorId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Visit Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(record.visitDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Record ID</p>
                    <p className="font-semibold text-foreground">#{record.id}</p>
                  </div>
                </div>

                {record.diagnosis && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Diagnosis</p>
                    <p className="text-foreground">{record.diagnosis}</p>
                  </div>
                )}

                {record.treatment && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Treatment</p>
                    <p className="text-foreground">{record.treatment}</p>
                  </div>
                )}

                {record.vitals && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Vitals</p>
                    <p className="text-foreground">{record.vitals}</p>
                  </div>
                )}

                {record.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-foreground">{record.notes}</p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </HospitalDashboardLayout>
  );
}
