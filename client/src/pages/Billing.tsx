import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, DollarSign, FileText, Download } from "lucide-react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Billing() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    patientId: "",
    billNumber: "",
    billDate: new Date().toISOString().split('T')[0],
    totalAmount: "",
    dueDate: "",
    treatmentCost: "",
    medicationCost: "",
    consultationFee: "",
    otherCharges: "",
    discount: "",
    notes: "",
  });

  const billsQuery = trpc.bill.getByPatient.useQuery(
    { patientId: user?.id || 0 },
    { enabled: !!user?.id }
  );
  const patientsQuery = trpc.patient.getAll.useQuery();
  const createMutation = trpc.bill.create.useMutation();
  const updateMutation = trpc.bill.update.useMutation();

  const bills = billsQuery.data || [];
  const patients = patientsQuery.data || [];

  const resetForm = () => {
    setFormData({
      patientId: "",
      billNumber: "",
      billDate: new Date().toISOString().split('T')[0],
      totalAmount: "",
      dueDate: "",
      treatmentCost: "",
      medicationCost: "",
      consultationFee: "",
      otherCharges: "",
      discount: "",
      notes: "",
    });
  };

  const handleAddBill = async () => {
    if (!formData.patientId || !formData.billNumber || !formData.totalAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        patientId: parseInt(formData.patientId),
        billNumber: formData.billNumber,
        billDate: new Date(formData.billDate),
        totalAmount: formData.totalAmount,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        treatmentCost: formData.treatmentCost || undefined,
        medicationCost: formData.medicationCost || undefined,
        consultationFee: formData.consultationFee || undefined,
        otherCharges: formData.otherCharges || undefined,
        discount: formData.discount || undefined,
        notes: formData.notes || undefined,
      });
      toast.success("Bill created successfully");
      resetForm();
      setIsAddOpen(false);
      billsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to create bill");
    }
  };

  const handleStatusChange = async (billId: number, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({
        id: billId,
        paymentStatus: newStatus as any,
      });
      toast.success("Bill status updated");
      billsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update bill");
    }
  };

  const getPatientName = (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
  };

  const filteredBills = (bills || []).filter((bill: any) => {
    if (searchQuery) {
      const patientName = getPatientName(bill.patientId).toLowerCase();
      return patientName.includes(searchQuery.toLowerCase()) || bill.billNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const totalAmount = filteredBills.reduce((sum: number, bill: any) => sum + (parseFloat(bill.totalAmount) || 0), 0);
  const paidAmount = filteredBills
    .filter((bill: any) => bill.paymentStatus === "paid")
    .reduce((sum: number, bill: any) => sum + (parseFloat(bill.totalAmount) || 0), 0);
  const pendingAmount = filteredBills
    .filter((bill: any) => bill.paymentStatus === "pending")
    .reduce((sum: number, bill: any) => sum + (parseFloat(bill.totalAmount) || 0), 0);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "badge badge-success";
      case "pending":
        return "badge badge-warning";
      case "overdue":
        return "badge badge-danger";
      default:
        return "badge badge-info";
    }
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">Billing & Invoicing</h1>
            <p className="text-muted-foreground mt-1">Manage patient bills and payment tracking</p>
          </div>
          {user?.role !== "doctor" && (
            <Button className="btn-primary" onClick={() => { resetForm(); setIsAddOpen(!isAddOpen); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Bill
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wide">Total Billing</p>
                <p className="text-3xl font-bold text-cyan-400 mt-2">${totalAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-cyan-400 opacity-50" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wide">Paid</p>
                <p className="text-3xl font-bold text-green-400 mt-2">${paidAmount.toFixed(2)}</p>
              </div>
              <FileText className="w-8 h-8 text-green-400 opacity-50" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-orange-400 mt-2">${pendingAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Add Bill Form */}
        {isAddOpen && user?.role !== "doctor" && (
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-cyan-400">Create New Bill</h2>
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
                <label className="form-label">Bill Number *</label>
                <input
                  type="text"
                  placeholder="e.g., BILL-001"
                  className="form-input"
                  value={formData.billNumber}
                  onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bill Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.billDate}
                  onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fee</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="form-input"
                  step="0.01"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Treatment Cost</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="form-input"
                  step="0.01"
                  value={formData.treatmentCost}
                  onChange={(e) => setFormData({ ...formData, treatmentCost: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Medication Cost</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="form-input"
                  step="0.01"
                  value={formData.medicationCost}
                  onChange={(e) => setFormData({ ...formData, medicationCost: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Other Charges</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="form-input"
                  step="0.01"
                  value={formData.otherCharges}
                  onChange={(e) => setFormData({ ...formData, otherCharges: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Discount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="form-input"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Total Amount *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="form-input"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
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
              <Button className="btn-primary" onClick={handleAddBill}>
                Create Bill
              </Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or description..."
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
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Bills Table */}
        <Card className="overflow-hidden">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Bill Number</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No bills found matching your search" : "No bills created yet"}
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill: any) => (
                    <tr key={bill.id}>
                      <td className="font-medium">{getPatientName(bill.patientId)}</td>
                      <td>{bill.billNumber}</td>
                      <td className="font-semibold text-cyan-400">${parseFloat(bill.totalAmount).toFixed(2)}</td>
                      <td>{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : "—"}</td>
                      <td>
                        <span className={getStatusBadgeClass(bill.paymentStatus)}>
                          {bill.paymentStatus.charAt(0).toUpperCase() + bill.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="p-2 hover:bg-background rounded transition-colors"
                            title="Download Invoice"
                          >
                            <Download className="w-4 h-4 text-cyan-400" />
                          </button>
                          {user?.role === "receptionist" && bill.paymentStatus === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(bill.id, "paid")}
                            >
                              Mark Paid
                            </Button>
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
