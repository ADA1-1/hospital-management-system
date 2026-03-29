import React, { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function UserProfile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const updatePhotoMutation = trpc.user.updatePhotoUrl.useMutation({
    onSuccess: () => {
      toast.success("Profile picture updated successfully!");
      setPreviewUrl(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update picture");
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { url } = await uploadResponse.json();

      // Update user profile with new photo URL
      await updatePhotoMutation.mutateAsync({
        photoUrl: url,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload picture";
      toast.error(errorMessage);
      console.error("Upload error:", error);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync(formData);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Picture Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewUrl || user?.photoUrl || ""} />
                <AvatarFallback>
                  {user?.name?.split(" ")[0]?.charAt(0)}
                  {user?.name?.split(" ")[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || updatePhotoMutation.isPending}
                className="w-full"
              >
                {uploading || updatePhotoMutation.isPending ? "Uploading..." : "Change Picture"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Max 5MB (JPG, PNG, GIF)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <p className="text-sm text-gray-900 capitalize">{user?.role || "User"}</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
