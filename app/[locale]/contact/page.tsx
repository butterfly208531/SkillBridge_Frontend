"use client";

import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Mail, Phone, Send } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const t = useTranslations("contactPage");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent!");
  };

  return (
    <div className="min-h-screen font-montserrat bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      {/* HERO BANNER */}
      <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2196F3]/90 to-gray-900/80 z-10" />
        <img
          src="https://i.ibb.co/gZjJvXrd/about_image2.jpg"
          alt="Contact Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Contact Us</h1>
          <p className="text-blue-100 text-base md:text-lg max-w-md mx-auto">{t("description")}</p>
        </div>
      </div>

      {/* MAIN CARD — overlaps hero */}
      <main className="flex-grow px-4 -mt-16 relative z-20 pb-0">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">

            {/* LEFT: Get in touch */}
            <div className="p-8 md:p-10 border-r border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Get in touch</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{t("description")}</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2196F3] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{t("office")}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{t("office_info")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2196F3] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{t("emailAddress")}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">skillbridgeinstituteoftech@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2196F3] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{t("phoneLabel")}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">+251-901-123-456</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">@skillbridgesupport2</p>
                  </div>
                </div>
              </div>

              {/* Social icons */}
              <div className="mt-10">
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest">Follow our social media</p>
                <div className="flex gap-3">
                  {["f", "in", "t", "yt"].map((s) => (
                    <div key={s} className="w-9 h-9 rounded-full bg-[#2196F3] flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                      <span className="text-white text-xs font-bold">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Send us a message */}
            <form onSubmit={handleSubmit} className="p-8 md:p-10">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Send us a message</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Name</label>
                  <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Phone</label>
                  <input name="phone" type="text" placeholder="Phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3]" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Email</label>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3]" />
              </div>
              <div className="mb-4">
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Subject</label>
                <input name="subject" type="text" placeholder="Subject" value={form.subject} onChange={handleChange}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3]" />
              </div>
              <div className="mb-6">
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Message</label>
                <textarea name="message" placeholder="Message" rows={4} value={form.message} onChange={handleChange} required
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] resize-none" />
              </div>
              <button type="submit"
                className="w-full bg-[#2196F3] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>

        {/* MAP */}
        <div className="max-w-5xl mx-auto mt-8 rounded-2xl overflow-hidden shadow-lg mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.6719600732655!2d38.75776007590039!3d9.030151990986828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f57f3d87ff%3A0x6f6242500e5b2a4a!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1687598230123"
            width="100%"
            height="380"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
