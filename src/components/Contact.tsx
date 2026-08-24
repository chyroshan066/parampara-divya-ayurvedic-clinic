"use client";

// --- Added: custom date/time pickers + Phosphor Phone icon replace the
// native <input type="date"/"time"> and the missing "#phone"/"#calendar"/"#clock"
// sprite symbols (those ids didn't exist in IconSprite, so the icons were
// silently not rendering before).
import { useState } from "react";
import { Phone } from "@phosphor-icons/react";
import { useSectionFade } from "@/hooks/useSectionFade";
import { DatePicker } from "@/components/utility/Datepicker";
import { TimePicker, type TimeValue } from "@/components/utility/Timepicker";
import { Toast, type ToastData } from "@/components/utility/Toast";

export const Contact = () => {
  const { ref, isVisible } = useSectionFade<HTMLElement>();

  // --- Added: local state for the two custom pickers. Kept as plain
  // useState since this is ephemeral form-widget state scoped to this
  // section, not shared app state — Redux/RTK Query stay reserved for
  // server/global state (e.g. the eventual submit mutation).
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<TimeValue | null>(
    null,
  );

  // --- Added: submission state for the actual POST to /api/appointments.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const toISODateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!appointmentDate || !appointmentTime) {
      setToast({
        type: "error",
        message: "Please select a date and time for your appointment.",
      });
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          date: toISODateString(appointmentDate),
          time: appointmentTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          type: "error",
          message: data.error || "Something went wrong. Please try again.",
        });
        return;
      }

      setToast({
        type: "success",
        message:
          "Thanks! Your appointment request has been received — we'll be in touch shortly.",
      });
      form.reset();
      setAppointmentDate(null);
      setAppointmentTime(null);
    } catch {
      setToast({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className={`section py-16 ${isVisible ? "" : "section-fade"} mb-10`}
    >
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-y-6 gap-x-20">
          {/* Map image */}
          <div className="relative lg:w-1/2">
            <iframe
              className="block w-full h-[440px] xs:h-[500px] lg:h-[610px] xl:h-[680px] rounded-3xl border-0"
              src="https://www.google.com/maps?q=Parampara+Divya+Ayurvedic,+Boudha,+Kathmandu&ll=27.7205469,85.3639108&z=17&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title="Parampara Divya Ayurvedic location map"
            />
            {/* Absolute Address */}
            <div className="absolute bg-white p-4 bottom-8 left-8 right-8 rounded-3xl flex gap-x-6 items-center">
              {/* icon */}
              <img
                className="block w-16 h-16"
                src="/images/icons/home-icon.webp"
                alt="home-icon"
              />
              {/* Address */}
              <div>
                <p className="text-xs text-primary font-bold mb-1">ADDRESS</p>
                <p className="font-bold text-slate-800 max-w-[260px]">
                  Boudha Main Street, Kathmandu
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 bg-gray-100 px-4 pt-10 pb-4 rounded-3xl lg:bg-transparent lg:p-0 lg:rounded-none">
            {/* Contact us info */}
            <div className="flex flex-col gap-y-4 text-center lg:text-start">
              <h4 className="text-sm text-primary font-bold">
                BOOK APPOINTMENT
              </h4>
              {/* Subtitle */}
              <p className="text-slate-800 text-4xl leading-snug font-bold lg:max-w-screen-sm">
                We&apos;d love to hear from you
              </p>
              {/* Description */}
              <p className="mx-auto lg:mx-0 text-[15px] font-medium text-slate-800/70">
                Have a question or ready to schedule a visit? Fill out the form
                below and our team will get back to you shortly.
              </p>
            </div>
            {/* Contact us form */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-7 mt-10 xl:mt-16"
            >
              {/* name input */}
              <div className="flex flex-col gap-y-2 relative">
                <label
                  className="font-bold text-[13px] text-slate-600/90"
                  htmlFor="name"
                >
                  NAME
                </label>
                <input
                  className="form-input"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name..."
                  required
                />
                <svg className="w-6 h-6 absolute bottom-4 left-4 text-slate-400">
                  <use href="#user"></use>
                </svg>
              </div>
              {/* phone number input */}
              <div className="flex flex-col gap-y-2 relative">
                <label
                  className="font-bold text-[13px] text-slate-600/90"
                  htmlFor="phone"
                >
                  PHONE NUMBER
                </label>
                <input
                  className="form-input"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number..."
                  required
                />
                {/* Changed: sprite had no "#phone" symbol — swapped in Phosphor's Phone icon */}
                <Phone className="w-6 h-6 absolute bottom-4 left-4 text-slate-400" />
              </div>
              {/* appointment date input */}
              {/* Changed: replaced native <input type="date"> with the custom DatePicker so styling is consistent across browsers/OSes */}
              <div className="flex flex-col gap-y-2">
                <label
                  className="font-bold text-[13px] text-slate-600/90"
                  htmlFor="date"
                >
                  DATE OF APPOINTMENT
                </label>
                <DatePicker
                  id="date"
                  value={appointmentDate}
                  onChange={setAppointmentDate}
                  placeholder="Select a date..."
                  required
                />
              </div>
              {/* appointment time input */}
              {/* Changed: replaced native <input type="time"> with the custom TimePicker for the same reason */}
              <div className="flex flex-col gap-y-2">
                <label
                  className="font-bold text-[13px] text-slate-600/90"
                  htmlFor="time"
                >
                  APPOINTMENT TIME
                </label>
                <TimePicker
                  id="time"
                  value={appointmentTime}
                  onChange={setAppointmentTime}
                  placeholder="Select a time..."
                  required
                />
              </div>
              {/* messages input */}
              <div className="flex flex-col gap-y-2 sm:col-span-2 relative">
                <label
                  className="font-bold text-[13px] text-slate-600/90"
                  htmlFor="message"
                >
                  MESSAGES
                </label>
                <textarea
                  className="form-input min-h-[234px] max-h-[234px] lg:min-h-[116px] lg:max-h-[116px] xl:min-h-[234px] xl:max-h-[234px]"
                  id="message"
                  name="message"
                  placeholder="Enter your messages..."
                  required
                ></textarea>
                <svg className="w-6 h-6 absolute top-[42px] left-4 text-slate-400">
                  <use href="#pencil-square"></use>
                </svg>
              </div>

              {/* Form submit button */}
              <div className="flex items-center justify-between sm:col-span-2">
                {/* Phone number */}
                <div className="hidden sm:flex items-center gap-x-4">
                  <img
                    className="block w-16 h-16"
                    src="/images/icons/phone-icon.webp"
                    alt="phone-icon.png"
                  />
                  <div>
                    <p className="text-primary font-bold text-sm">Call Us</p>
                    <p className="text-slate-800 font-bold mt-1">
                      +977 9713164487
                    </p>
                  </div>
                </div>
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full sm:w-44 bg-primary text-white text-sm font-bold text-center leading-[3rem] rounded-xl transition-colors hover:bg-primary-hover disabled:opacity-60"
                >
                  {isSubmitting ? "Booking..." : "Book an appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
