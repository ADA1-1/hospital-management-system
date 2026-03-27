import PublicLayout from "@/components/PublicLayout";
import { Heart, Users, Zap, Award } from "lucide-react";

export default function About() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-cyan-900 mb-4">About ADASIT HOSPITAL</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Advanced Digital Healthcare Management System dedicated to providing comprehensive hospital management solutions
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg p-8 border border-cyan-200 shadow-lg">
            <h2 className="text-2xl font-bold text-cyan-600 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To streamline hospital operations and improve patient care through innovative digital healthcare management solutions. We empower healthcare professionals with tools to manage patients, appointments, medical records, and billing efficiently.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-orange-200 shadow-lg">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              To be the leading healthcare management platform that transforms hospital operations, enhances patient experiences, and enables healthcare providers to deliver exceptional care with confidence and efficiency.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-cyan-900 text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
              <Heart className="w-12 h-12 text-cyan-600 mb-4" />
              <h3 className="text-lg font-bold text-cyan-900 mb-2">Patient Care</h3>
              <p className="text-slate-600 text-sm">
                Prioritizing patient well-being and satisfaction in every decision we make
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
              <Users className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold text-orange-900 mb-2">Collaboration</h3>
              <p className="text-slate-600 text-sm">
                Working together with healthcare professionals to achieve excellence
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <Zap className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-bold text-green-900 mb-2">Innovation</h3>
              <p className="text-slate-600 text-sm">
                Continuously improving our solutions to meet evolving healthcare needs
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <Award className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold text-purple-900 mb-2">Excellence</h3>
              <p className="text-slate-600 text-sm">
                Delivering high-quality solutions and exceptional service standards
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-12 border border-cyan-200">
          <h2 className="text-3xl font-bold text-cyan-900 mb-8 text-center">Why Choose ADASIT HOSPITAL?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-cyan-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-cyan-900 mb-2">Comprehensive Solution</h3>
                <p className="text-slate-600">
                  Complete hospital management from patient registration to billing
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-cyan-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-cyan-900 mb-2">User-Friendly Interface</h3>
                <p className="text-slate-600">
                  Intuitive design that requires minimal training for staff
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-cyan-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-cyan-900 mb-2">Secure & Reliable</h3>
                <p className="text-slate-600">
                  Enterprise-grade security for patient data protection
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-cyan-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-cyan-900 mb-2">24/7 Support</h3>
                <p className="text-slate-600">
                  Dedicated support team available round the clock
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
