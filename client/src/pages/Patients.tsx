import React from "react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";

export default function Patients() {
  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Patient Management</h1>
          <p className="text-muted-foreground mt-1">Patient management module coming soon</p>
        </div>
      </div>
    </HospitalDashboardLayout>
  );
}
