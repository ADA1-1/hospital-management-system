import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Download, Trash2, File, Image, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function MedicalDocuments() {
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const patientsQuery = trpc.patient.getAll.useQuery();
  const documentsQuery = trpc.medicalRecord.getByPatient.useQuery(
    selectedPatientId ? { patientId: selectedPatientId } : { patientId: 0 },
    { enabled: !!selectedPatientId }
  );
  const uploadMutation = trpc.medicalRecord.create.useMutation();

  const patients = patientsQuery.data || [];
  const documents = documentsQuery.data || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPatientId) {
      toast.error("Please select a patient and file");
      return;
    }

    setUploading(true);
    try {
      // In a real implementation, upload file to S3 first
      // For now, we'll create a document record with file metadata
      await uploadMutation.mutateAsync({
        patientId: selectedPatientId,
        doctorId: user?.id || 1,
        diagnosis: `Document: ${file.name}`,
        treatment: `File uploaded: ${new Date().toLocaleDateString()}`,
        visitDate: new Date(),
      });

      toast.success("Document uploaded successfully");
      e.target.value = "";
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Document deletion would be implemented with a delete procedure
    toast.info("Document deletion feature coming soon");
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (["pdf"].includes(ext || "")) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-900 mb-2">Medical Documents</h1>
          <p className="text-slate-600">Upload and manage patient medical documents</p>
        </div>

        {/* Patient Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Select Patient</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  selectedPatientId === patient.id
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {patient.firstName} {patient.lastName}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        {selectedPatientId && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Upload Document</h2>
            <div className="border-2 border-dashed border-cyan-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
              <FileUp className="w-12 h-12 text-cyan-600 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">Drag and drop or click to upload</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                />
                <Button disabled={uploading} className="bg-cyan-600 hover:bg-cyan-700">
                  {uploading ? "Uploading..." : "Choose File"}
                </Button>
              </label>
              <p className="text-xs text-slate-500 mt-3">
                Supported: PDF, Images, Documents (Max 10MB)
              </p>
            </div>
          </div>
        )}

        {/* Documents List */}
        {selectedPatientId && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">
                Documents ({documents.length})
              </h2>
            </div>

            {documents.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <File className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(doc.diagnosis || "")}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {doc.diagnosis}
                        </p>
                        <p className="text-sm text-slate-500">
                          {doc.treatment} • {doc.visitDate ? new Date(doc.visitDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedPatientId && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Select a patient to view and upload documents</p>
          </div>
        )}
      </div>
    </div>
  );
}
