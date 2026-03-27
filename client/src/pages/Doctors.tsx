import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit2, X } from "lucide-react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const specializations = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "General Practice",
  "Surgery",
  "Oncology",
  "Radiology",
];

export default function Doctors() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({
    userId: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    workingDays: "",
    consultationFee: "",
  });

  const doctorsQuery = trpc.doctor.getAll.useQuery();
  const searchQueryTrpc = trpc.doctor.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );
  const createMutation = trpc.doctor.create.useMutation();
  const updateMutation = trpc.doctor.update.useMutation();

  const doctors = searchQuery.length > 0 ? searchQueryTrpc.data || [] : doctorsQuery.data || [];

  const resetForm = () => {
    setFormData({
      userId: 0,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      licenseNumber: "",
      yearsOfExperience: "",
      workingDays: "",
      consultationFee: "",
    });
    setSelectedDoctor(null);
  };

  const handleAddDoctor = async () => {
    if (!formData.firstName || !formData.lastName || !formData.specialization) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : 0,
      });
      toast.success("Doctor added successfully");
      resetForm();
      setIsAddOpen(false);
      doctorsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to add doctor");
    }
  };

  const handleUpdateDoctor = async () => {
    if (!selectedDoctor?.id) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedDoctor.id,
        ...formData,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : 0,
      });
      toast.success("Doctor updated successfully");
      resetForm();
      setSelectedDoctor(null);
      doctorsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update doctor");
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    if (user?.role !== "admin") {
      toast.error("Only admins can delete doctors");
      return;
    }
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    toast.info("Delete functionality coming soon");
  };

  const handleEditClick = (doctor: any) => {
    setSelectedDoctor(doctor);
    setFormData({
      userId: doctor.userId || 0,
      firstName: doctor.firstName || "",
      lastName: doctor.lastName || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      specialization: doctor.specialization || "",
      licenseNumber: doctor.licenseNumber || "",
      yearsOfExperience: doctor.yearsOfExperience?.toString() || "",
      workingDays: doctor.workingDays || "",
      consultationFee: doctor.consultationFee || "",
    });
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">Doctor Management</h1>
            <p className="text-muted-foreground mt-1">Manage doctors and their specializations</p>
          </div>
          {user?.role === "admin" && (
            <Button className="btn-primary" onClick={() => { resetForm(); setIsAddOpen(!isAddOpen); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAddOpen || selectedDoctor) && user?.role === "admin" && (
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-cyan-400">
                {selectedDoctor ? "Edit Doctor" : "Add New Doctor"}
              </h2>
              <button
                onClick={() => { resetForm(); setIsAddOpen(false); }}
                className="p-2 hover:bg-background rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="form-input"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="form-input"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  placeholder="Phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <select
                  className="form-input"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">License Number</label>
                <input
                  type="text"
                  placeholder="Medical License Number"
                  className="form-input"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  placeholder="Years"
                  className="form-input"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Working Days</label>
                <input
                  type="text"
                  placeholder="e.g., Monday-Friday"
                  className="form-input"
                  value={formData.workingDays}
                  onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fee</label>
                <input
                  type="text"
                  placeholder="e.g., $50"
                  className="form-input"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => { resetForm(); setIsAddOpen(false); }}>
                Cancel
              </Button>
              <Button
                className="btn-primary"
                onClick={selectedDoctor ? handleUpdateDoctor : handleAddDoctor}
              >
                {selectedDoctor ? "Update Doctor" : "Add Doctor"}
              </Button>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or specialization..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Doctors Table */}
        <Card className="overflow-hidden">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Available Hours</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No doctors found matching your search" : "No doctors registered yet"}
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td className="font-medium">{doctor.firstName} {doctor.lastName}</td>
                      <td>{doctor.email || "—"}</td>
                      <td>{doctor.phone || "—"}</td>
                      <td>
                        <span className="badge badge-success">{doctor.specialization}</span>
                      </td>
                      <td>{doctor.yearsOfExperience} years</td>
                      <td>{doctor.workingDays || "—"}</td>
                      <td>
                        <div className="flex gap-2">
                          {user?.role === "admin" && (
                            <>
                              <button
                                className="p-2 hover:bg-background rounded transition-colors"
                                title="Edit"
                                onClick={() => handleEditClick(doctor)}
                              >
                                <Edit2 className="w-4 h-4 text-orange-400" />
                              </button>
                              <button
                                className="p-2 hover:bg-background rounded transition-colors opacity-50 cursor-not-allowed"
                                title="Delete (Coming Soon)"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </HospitalDashboardLayout>
  );
}
