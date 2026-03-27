import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit2, Eye, X } from "lucide-react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Patients() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male" as const,
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bloodType: "",
    allergies: "",
  });

  const patientsQuery = trpc.patient.getAll.useQuery();
  const searchQueryTrpc = trpc.patient.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );
  const createMutation = trpc.patient.create.useMutation();
  const updateMutation = trpc.patient.update.useMutation();
  const deleteMutation = trpc.patient.delete.useMutation();

  const patients = searchQuery.length > 0 ? searchQueryTrpc.data || [] : patientsQuery.data || [];

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "male",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      bloodType: "",
      allergies: "",
    });
    setSelectedPatient(null);
  };

  const handleAddPatient = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      });
      toast.success("Patient added successfully");
      resetForm();
      setIsAddOpen(false);
      patientsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to add patient");
    }
  };

  const handleUpdatePatient = async () => {
    if (!selectedPatient?.id) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedPatient.id,
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      });
      toast.success("Patient updated successfully");
      resetForm();
      setSelectedPatient(null);
      patientsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update patient");
    }
  };

  const handleDeletePatient = async (id: number) => {
    if (user?.role !== "admin") {
      toast.error("Only admins can delete patients");
      return;
    }
    if (!confirm("Are you sure you want to delete this patient?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Patient deleted successfully");
      patientsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete patient");
    }
  };

  const handleEditClick = (patient: any) => {
    setSelectedPatient(patient);
    setFormData({
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      email: patient.email || "",
      phone: patient.phone || "",
      gender: patient.gender || "male",
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split("T")[0] : "",
      address: patient.address || "",
      city: patient.city || "",
      state: patient.state || "",
      zipCode: patient.zipCode || "",
      bloodType: patient.bloodType || "",
      allergies: patient.allergies || "",
    });
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">Patient Management</h1>
            <p className="text-muted-foreground mt-1">Manage patient records and information</p>
          </div>
          {user?.role !== "doctor" && (
            <Button className="btn-primary" onClick={() => { resetForm(); setIsAddOpen(!isAddOpen); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAddOpen || selectedPatient) && (
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-cyan-400">
                {selectedPatient ? "Edit Patient" : "Add New Patient"}
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
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  placeholder="Phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-input"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Type</label>
                <input
                  type="text"
                  placeholder="Blood Type (e.g., O+, A-)"
                  className="form-input"
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  placeholder="City"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Address</label>
                <textarea
                  placeholder="Street Address"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Allergies</label>
                <textarea
                  placeholder="List any known allergies"
                  className="form-input"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => { resetForm(); setIsAddOpen(false); }}>
                Cancel
              </Button>
              <Button
                className="btn-primary"
                onClick={selectedPatient ? handleUpdatePatient : handleAddPatient}
              >
                {selectedPatient ? "Update Patient" : "Add Patient"}
              </Button>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Patients Table */}
        <Card className="overflow-hidden">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Blood Type</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No patients found matching your search" : "No patients registered yet"}
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="font-medium">{patient.firstName} {patient.lastName}</td>
                      <td>{patient.email || "—"}</td>
                      <td>{patient.phone}</td>
                      <td className="capitalize">{patient.gender || "—"}</td>
                      <td>
                        <span className="badge badge-info">{patient.bloodType || "—"}</span>
                      </td>
                      <td>{patient.city || "—"}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="p-2 hover:bg-background rounded transition-colors"
                            title="View"
                            onClick={() => handleEditClick(patient)}
                          >
                            <Eye className="w-4 h-4 text-cyan-400" />
                          </button>
                          {user?.role !== "doctor" && (
                            <>
                              <button
                                className="p-2 hover:bg-background rounded transition-colors"
                                title="Edit"
                                onClick={() => handleEditClick(patient)}
                              >
                                <Edit2 className="w-4 h-4 text-orange-400" />
                              </button>
                              {user?.role === "admin" && (
                                <button
                                  className="p-2 hover:bg-background rounded transition-colors"
                                  onClick={() => handleDeletePatient(patient.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              )}
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
