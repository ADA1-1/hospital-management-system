import React, { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function StakeholderProfile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const stakeholderQuery = trpc.stakeholder.getByUserId.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  const uploadPhotoMutation = trpc.stakeholder.uploadPhoto.useMutation({
    onSuccess: () => {
      toast.success("Profile picture uploaded successfully!");
      setPreviewUrl(null);
      stakeholderQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload picture");
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
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const { url, key } = await uploadResponse.json();

      // Save to database
      if (stakeholderQuery.data) {
        await uploadPhotoMutation.mutateAsync({
          id: stakeholderQuery.data.id,
          photoUrl: url,
          photoKey: key,
        });
      }
    } catch (error) {
      toast.error("Failed to upload picture");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const stakeholder = stakeholderQuery.data;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Stakeholder Profile</CardTitle>
          <CardDescription>Manage your profile information and picture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewUrl || stakeholder?.photoUrl || ""} />
              <AvatarFallback>
                {stakeholder?.firstName?.charAt(0)}
                {stakeholder?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

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
                disabled={uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload Picture"}
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Max file size: 5MB (JPG, PNG, GIF)
              </p>
            </div>
          </div>

          {/* Profile Information */}
          {stakeholder && (
            <div className="space-y-4 border-t pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-sm text-gray-900">{stakeholder.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-sm text-gray-900">{stakeholder.lastName}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{stakeholder.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{stakeholder.phone || "N/A"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Organization</label>
                <p className="mt-1 text-sm text-gray-900">{stakeholder.organization || "N/A"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Position</label>
                <p className="mt-1 text-sm text-gray-900">{stakeholder.position || "N/A"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Stakeholder Type</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {stakeholder.stakeholderType || "N/A"}
                </p>
              </div>

              {stakeholder.bio && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <p className="mt-1 text-sm text-gray-900">{stakeholder.bio}</p>
                </div>
              )}
            </div>
          )}

          {stakeholderQuery.isLoading && (
            <p className="text-center text-gray-500">Loading profile...</p>
          )}

          {!stakeholder && !stakeholderQuery.isLoading && (
            <p className="text-center text-gray-500">No stakeholder profile found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
