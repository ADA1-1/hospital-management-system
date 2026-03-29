import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit2, X, Upload, Camera } from "lucide-react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import AdminOnly from "@/components/AdminOnly";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { uploadFile } from "@/lib/storage";

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
  return (
    <AdminOnly>
      <DoctorsContent />
    </AdminOnly>
  );
}

function DoctorsContent() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
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
    photoUrl: "",
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
      photoUrl: "",
    });
    setPhotoUrl("");
    setSelectedDoctor(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const url = await uploadFile(file, `doctor-${Date.now()}`);
      setPhotoUrl(url);
      setFormData({ ...formData, photoUrl: url });
      toast.success("Photo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
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
    setPhotoUrl(doctor.photoUrl || "");
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
      photoUrl: doctor.photoUrl || "",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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

            {/* Photo Upload Section */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Doctor"
                    className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-xl font-bold border-4 border-cyan-400">
                    {formData.firstName && formData.lastName ? getInitials(formData.firstName, formData.lastName) : <Camera className="w-8 h-8" />}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>
              {isUploadingPhoto && <p className="text-sm text-muted-foreground">Uploading photo...</p>}
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
                  type="number"
                  placeholder="Consultation Fee"
                  className="form-input"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={selectedDoctor ? handleUpdateDoctor : handleAddDoctor}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
              >
                {selectedDoctor ? "Update Doctor" : "Add Doctor"}
              </Button>
              <Button
                onClick={() => { resetForm(); setIsAddOpen(false); }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Doctors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor: any) => (
            <Card key={doctor.id} className="p-6 bg-card border border-border hover:border-cyan-400 transition-colors">
              <div className="flex flex-col items-center text-center mb-4">
                {doctor.photoUrl ? (
                  <img
                    src={doctor.photoUrl}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-cyan-400 mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-lg font-bold border-4 border-orange-400 mb-3">
                    {getInitials(doctor.firstName, doctor.lastName)}
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">
                  {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="text-sm text-cyan-600 font-semibold">{doctor.specialization}</p>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <p><span className="font-semibold">Email:</span> {doctor.email}</p>
                <p><span className="font-semibold">Phone:</span> {doctor.phone}</p>
                <p><span className="font-semibold">License:</span> {doctor.licenseNumber}</p>
                <p><span className="font-semibold">Experience:</span> {doctor.yearsOfExperience} years</p>
                <p><span className="font-semibold">Working Days:</span> {doctor.workingDays}</p>
                <p><span className="font-semibold">Fee:</span> ${doctor.consultationFee}</p>
              </div>

              {user?.role === "admin" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditClick(doctor)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {doctors.length === 0 && (
          <Card className="p-12 text-center bg-card border border-border">
            <p className="text-muted-foreground">No doctors found. Add one to get started!</p>
          </Card>
        )}
      </div>
    </HospitalDashboardLayout>
  );
}
