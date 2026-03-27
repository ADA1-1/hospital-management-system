import PublicLayout from "@/components/PublicLayout";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your message. We will get back to you soon!");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-cyan-900 mb-4">Contact Us</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help and answer any questions you might have
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-cyan-900 mb-8">Get In Touch</h2>
            
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-600 text-white">
                    <Phone className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Phone</h3>
                  <p className="text-slate-600">+1 (555) 123-4567</p>
                  <p className="text-slate-600">+1 (555) 987-6543</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Email</h3>
                  <p className="text-slate-600">info@adasithospital.com</p>
                  <p className="text-slate-600">support@adasithospital.com</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Address</h3>
                  <p className="text-slate-600">123 Medical Center Drive</p>
                  <p className="text-slate-600">City, State 12345</p>
                  <p className="text-slate-600">Country</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Business Hours</h3>
                  <p className="text-slate-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-slate-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-slate-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-cyan-900 mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold py-3 rounded-lg"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-slate-200 rounded-lg overflow-hidden h-96 border border-slate-300">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Map location will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
