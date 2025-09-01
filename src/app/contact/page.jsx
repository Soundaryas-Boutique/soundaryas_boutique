import { Phone, Mail, MessageCircle, PhoneCall } from "lucide-react";
import ContactForm from "../../../components/ContactForm";
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white shadow-lg rounded-2xl overflow-hidden">
        
        {/* Left Section - Contact Info */}
        <div className="bg-[#B22222] text-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="mb-8 text-gray-100">
            We'd love to hear from you! Reach out to us through any of the following:
          </p>

          <ul className="space-y-6">
            <li className="flex items-center gap-3">
              <PhoneCall className="w-6 h-6" />
              <span>Call us: +91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <span>Email: support@soundaryasboutique.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <span>Chat with us (Live Support)</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              <span>WhatsApp: +91 98765 43210</span>
            </li>
          </ul>
        </div>

        {/* Right Section - Contact Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
