import PublicLayout from "@/components/PublicLayout";
import { Users, Calendar, FileText, DollarSign, Upload, Bell } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Users className="w-12 h-12 text-cyan-600" />,
      title: "Patient Management",
      description: "Complete patient registration, profile management, and medical history tracking with secure data storage",
      features: ["Patient Registration", "Profile Management", "Medical History", "Document Storage"],
    },
    {
      icon: <Calendar className="w-12 h-12 text-orange-600" />,
      title: "Appointment Scheduling",
      description: "Efficient appointment booking, rescheduling, and cancellation with automated reminders",
      features: ["Easy Booking", "Rescheduling", "Cancellation", "Automated Reminders"],
    },
    {
      icon: <FileText className="w-12 h-12 text-green-600" />,
      title: "Medical Records",
      description: "Comprehensive medical records management including diagnoses, treatments, and prescriptions",
      features: ["Diagnoses Recording", "Treatment Notes", "Prescriptions", "Visit History"],
    },
    {
      icon: <DollarSign className="w-12 h-12 text-purple-600" />,
      title: "Billing System",
      description: "Automated billing, invoice generation, and payment tracking with multiple payment options",
      features: ["Invoice Generation", "Payment Tracking", "Payment History", "Cost Calculation"],
    },
    {
      icon: <Upload className="w-12 h-12 text-blue-600" />,
      title: "Document Management",
      description: "Secure storage and management of medical reports, lab results, and X-rays",
      features: ["Report Storage", "Lab Results", "X-ray Management", "Secure Access"],
    },
    {
      icon: <Bell className="w-12 h-12 text-red-600" />,
      title: "Notifications",
      description: "Automated appointment reminders, billing notifications, and prescription alerts",
      features: ["Appointment Reminders", "Billing Alerts", "Prescription Notifications", "SMS/Email"],
    },
  ];

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-cyan-900 mb-4">Our Services</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive healthcare management solutions designed to streamline hospital operations and improve patient care
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 border border-slate-200 hover:border-cyan-400 hover:shadow-lg transition-all"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-slate-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-12 border border-cyan-200">
          <h2 className="text-3xl font-bold text-cyan-900 mb-8 text-center">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-cyan-900 mb-3">Role-Based Access Control</h3>
              <p className="text-slate-600 mb-4">
                Secure access management with different user roles (Admin, Doctor, Receptionist) ensuring data privacy and appropriate permissions
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-cyan-900 mb-3">Real-Time Dashboard</h3>
              <p className="text-slate-600 mb-4">
                Live metrics and analytics with role-specific dashboards showing key performance indicators and quick actions
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-cyan-900 mb-3">Search & Filtering</h3>
              <p className="text-slate-600 mb-4">
                Powerful search capabilities across patients, doctors, and appointments with advanced filtering options
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-cyan-900 mb-3">Secure Payment Processing</h3>
              <p className="text-slate-600 mb-4">
                Integrated Stripe payment processing for secure online bill payments and transaction tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
