"use client";

import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import React, { useState } from "react";

const BookingPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-montserrat bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-[#2196F3] mb-2">Book Career Guidance</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Schedule a one-on-one session with our career advisors.
          </p>

          {submitted ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We'll reach out to confirm your session details shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="shadow-lg p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4"
            >
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-[#2196F3]"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-[#2196F3]"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-[#2196F3]"
                value={form.phone}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="date"
                  type="date"
                  className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-[#2196F3]"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
                <input
                  name="time"
                  type="time"
                  className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-[#2196F3]"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <select
                name="topic"
                className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-[#2196F3]"
                value={form.topic}
                onChange={handleChange}
                required
              >
                <option value="">Select a Topic</option>
                <option value="cv-review">CV Review</option>
                <option value="interview-prep">Interview Preparation</option>
                <option value="linkedin">LinkedIn Profile</option>
                <option value="portfolio">Portfolio Review</option>
                <option value="job-search">Job Search Strategy</option>
                <option value="other">Other</option>
              </select>
              <textarea
                name="message"
                placeholder="Additional notes (optional)"
                className="w-full border px-4 py-2 rounded-lg h-28 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-[#2196F3]"
                value={form.message}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="w-full bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Book Session
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
