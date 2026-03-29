import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit2, Eye, X, Upload } from "lucide-react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import AdminOnly from "@/components/AdminOnly";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { storagePut } from "@/lib/storage";

export default function Patients() {
  return (
    <AdminOnly>
      <PatientsContent />
    </AdminOnly>
  );
}

function PatientsContent() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    photoUrl: "",
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
  const uploadPhotoMutation = trpc.patient.uploadPhoto.useMutation();

  const patients = searchQuery.length > 0 ? searchQueryTrpc.data || [] : patientsQuery.data || [];

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      photoUrl: "",
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        gender: formData.gender as any,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        bloodType: formData.bloodType || undefined,
        allergies: formData.allergies || undefined,
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
    if (!selectedPatient) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedPatient.id,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        photoUrl: formData.photoUrl || undefined,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        gender: formData.gender as any,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        bloodType: formData.bloodType || undefined,
        allergies: formData.allergies || undefined,
      });
      toast.success("Patient updated successfully");
      resetForm();
      patientsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update patient");
    }
  };

  const handleDeletePatient = async (id: number) => {
    if (!user || user.role !== "admin") {
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, patientId?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const buffer = await file.arrayBuffer();
      const { url } = await storagePut(
        `patients/${patientId || "new"}-${Date.now()}.jpg`,
        new Uint8Array(buffer),
        file.type
      );

      if (patientId && selectedPatient?.id === patientId) {
        // Update existing patient
        await uploadPhotoMutation.mutateAsync({
          id: patientId,
          photoUrl: url,
        });
        setFormData({ ...formData, photoUrl: url });
        toast.success("Photo uploaded successfully");
        patientsQuery.refetch();
      } else {
        // Set for new patient
        setFormData({ ...formData, photoUrl: url });
        toast.success("Photo selected");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleEditClick = (patient: any) => {
    setSelectedPatient(patient);
    setFormData({
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      email: patient.email || "",
      phone: patient.phone || "",
      photoUrl: patient.photoUrl || "",
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
            <h1 className="text-3xl font-bold text-cyan-600">Patient Management</h1>
            <p className="text-slate-600 mt-1">Manage patient records and information</p>
          </div>
          {user?.role !== "doctor" && (
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => { resetForm(); setIsAddOpen(!isAddOpen); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAddOpen || selectedPatient) && (
          <Card className="p-6 bg-white border border-cyan-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-cyan-900">
                {selectedPatient ? "Edit Patient" : "Add New Patient"}
              </h2>
              <button
                onClick={() => { resetForm(); setIsAddOpen(false); }}
                className="p-2 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Upload Section */}
            <div className="mb-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <label className="block text-sm font-semibold text-cyan-900 mb-3">Profile Photo</label>
              <div className="flex items-center gap-4">
                {formData.photoUrl && (
                  <img
                    src={formData.photoUrl}
                    alt="Patient photo"
                    className="w-20 h-20 rounded-full object-cover border-2 border-cyan-300"
                  />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, selectedPatient?.id)}
                    disabled={isUploadingPhoto}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <button
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      disabled={isUploadingPhoto}
                    >
                      <Upload className="w-4 h-4" />
                      {isUploadingPhoto ? "Uploading..." : "Upload Photo"}
                    </button>
                  </label>
                  <p className="text-xs text-slate-600 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Blood Type</label>
                <input
                  type="text"
                  placeholder="e.g., O+, A-, B+"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="City"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="State"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  placeholder="Zip Code"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                <textarea
                  placeholder="Full address"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Allergies</label>
                <textarea
                  placeholder="List any known allergies"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={selectedPatient ? handleUpdatePatient : handleAddPatient}
              >
                {selectedPatient ? "Update Patient" : "Add Patient"}
              </Button>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            className="pl-10 border-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Patients Table */}
        <Card className="overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Photo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Gender</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Blood Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">City</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500">
                      {searchQuery ? "No patients found matching your search" : "No patients registered yet"}
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        {patient.photoUrl ? (
                          <img
                            src={patient.photoUrl}
                            alt={`${patient.firstName} ${patient.lastName}`}
                            className="w-10 h-10 rounded-full object-cover border border-cyan-300"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-semibold">
                            {patient.firstName?.[0]}{patient.lastName?.[0]}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{patient.firstName} {patient.lastName}</td>
                      <td className="px-6 py-4 text-slate-600">{patient.email || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{patient.phone}</td>
                      <td className="px-6 py-4 capitalize text-slate-600">{patient.gender || "—"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                          {patient.bloodType || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{patient.city || "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="p-2 hover:bg-slate-200 rounded transition-colors"
                            title="View/Edit"
                            onClick={() => handleEditClick(patient)}
                          >
                            <Edit2 className="w-4 h-4 text-cyan-600" />
                          </button>
                          {user?.role === "admin" && (
                            <button
                              className="p-2 hover:bg-slate-200 rounded transition-colors"
                              onClick={() => handleDeletePatient(patient.id)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
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
