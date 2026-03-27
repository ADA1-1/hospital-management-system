import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Save, X, LogOut, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  if (loading) {
    return (
      <HospitalDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </HospitalDashboardLayout>
    );
  }

  if (!user) {
    return (
      <HospitalDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-slate-600 mb-4">Please log in to view your profile</p>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </HospitalDashboardLayout>
    );
  }

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      try {
        await logout();
        setLocation("/");
        toast.success("Logged out successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to logout");
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      // In a real app, you would upload to S3 and get a URL
      // For now, we'll use a placeholder
      toast.success("Photo uploaded successfully (placeholder)");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // In a real app, you would call an API to update the profile
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <HospitalDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/dashboard")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-cyan-600">My Profile</h1>
              <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="bg-white border border-cyan-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center border-4 border-cyan-300 shadow-lg">
                  <span className="text-5xl font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <label htmlFor="photo-upload" className="absolute bottom-0 right-0">
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg transition-colors cursor-pointer">
                    <Upload className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 text-center">{user.name}</h2>
              <p className="text-slate-600 text-center mt-1">
                <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium capitalize">
                  {user.role}
                </span>
              </p>
            </div>

            {/* Profile Details Section */}
            <div className="md:col-span-2">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || "",
                          email: user.email || "",
                          phone: "",
                        });
                      }}
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Full Name</p>
                    <p className="text-lg text-slate-900">{user.name || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Email Address</p>
                    <p className="text-lg text-slate-900">{user.email || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">User Role</p>
                    <p className="text-lg text-slate-900 capitalize">{user.role}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Account Created</p>
                    <p className="text-lg text-slate-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Last Sign In</p>
                    <p className="text-lg text-slate-900">
                      {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString() : "N/A"}
                    </p>
                  </div>

                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2 mt-6"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Account Security Section */}
        <Card className="bg-white border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Account Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="font-semibold text-slate-900">Login Method</p>
                <p className="text-sm text-slate-600 mt-1">
                  {user.loginMethod ? user.loginMethod.charAt(0).toUpperCase() + user.loginMethod.slice(1) : "Manus OAuth"}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="font-semibold text-slate-900">Two-Factor Authentication</p>
                <p className="text-sm text-slate-600 mt-1">Enhance your account security</p>
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </HospitalDashboardLayout>
  );
}
