
"use client";

import { useState } from "react";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    mobile: "",
    speciality: "",
    appointmentDate: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setStatus("");
    setIsSuccess(false);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setStatus("");
    setIsSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit appointment request."
        );
      }

      setIsSuccess(true);
      setStatus(
        `Appointment request submitted successfully! Your Request ID is #${data.appointmentId}. Status: ${data.status}.`
      );

      setFormData({
        patientName: "",
        mobile: "",
        speciality: "",
        appointmentDate: "",
        message: "",
      });
    } catch (error) {
      setIsSuccess(false);

      setStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return (
    <section id="appointment" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl">

        {/* Section Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 font-semibold uppercase tracking-wider text-blue-600">
            Book an appointment
          </p>

          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Request a Doctor Appointment
          </h2>

          <p className="text-slate-600">
            Fill in your details and submit an appointment request.
          </p>
        </div>

        {/* Appointment Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-lg md:p-10"
        >
          {/* Patient Name */}
          <div>
            <label
              htmlFor="patientName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Patient Name *
            </label>

            <input
              id="patientName"
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              maxLength={100}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobile"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Mobile Number *
            </label>

            <input
              id="mobile"
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your 10-digit mobile number"
              pattern="[6-9][0-9]{9}"
              title="Enter a valid 10-digit Indian mobile number"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          {/* Speciality */}
          <div>
            <label
              htmlFor="speciality"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Select Speciality *
            </label>

            <select
              id="speciality"
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
            >
              <option value="">Choose a speciality</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Gynecology">Gynecology</option>
            </select>
          </div>

          {/* Appointment Date */}
          <div>
            <label
              htmlFor="appointmentDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Preferred Appointment Date *
            </label>

            <input
              id="appointmentDate"
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={today}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          {/* Additional Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Additional Message (Optional)
            </label>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter any additional appointment-related information"
              rows={4}
              maxLength={500}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : "Submit Appointment Request"}
          </button>

          {/* Success / Error Message */}
          {status && (
            <p
              role="status"
              aria-live="polite"
              className={`rounded-lg p-4 text-sm ${
                isSuccess
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {status}
            </p>
          )}

          <p className="text-center text-xs text-slate-500">
            This is an appointment request, not a confirmed booking.
          </p>
        </form>
      </div>
    </section>
  );
}
