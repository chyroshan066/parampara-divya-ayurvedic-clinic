// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// import { sql } from "@/utils/db";
// import { formatTimeValue } from "@/utils/time-utils";

// const timeValueSchema = z.object({
//   hour: z.number().int().min(1).max(12),
//   minute: z.union([z.literal(0), z.literal(15), z.literal(30), z.literal(45)]),
//   period: z.union([z.literal("AM"), z.literal("PM")]),
// });

// const appointmentSchema = z.object({
//   name: z.string().trim().min(1, "Please enter your name.").max(120),
//   phone: z.string().trim().min(6, "Please enter a valid phone number.").max(30),
//   date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date."),
//   time: timeValueSchema,
//   message: z.string().trim().min(1, "Please enter a message.").max(2000),
// });

// function timeToMinutes(time: z.infer<typeof timeValueSchema>) {
//   const hour24 = (time.hour % 12) + (time.period === "PM" ? 12 : 0);
//   return hour24 * 60 + time.minute;
// }

// export async function POST(request: NextRequest) {
//   const body = await request.json().catch(() => null);
//   const parsed = appointmentSchema.safeParse(body);

//   if (!parsed.success) {
//     return NextResponse.json(
//       { error: parsed.error.issues[0]?.message || "Please check your details and try again." },
//       { status: 400 }
//     );
//   }

//   const { name, phone, date, time, message } = parsed.data;
//   const timeLabel = formatTimeValue(time);
//   const timeMinutes = timeToMinutes(time);

//   const rows = await sql`
//     insert into appointments
//       (name, phone, message, appointment_date, appointment_time_label, appointment_time_minutes)
//     values
//       (${name}, ${phone}, ${message}, ${date}, ${timeLabel}, ${timeMinutes})
//     returning id
//   `;

//   return NextResponse.json({ success: true, id: rows[0]?.id });
// }


























import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { formatTimeValue } from "@/utils/time-utils";
import { sendAppointmentEmail } from "@/utils/email";

const timeValueSchema = z.object({
  hour: z.number().int().min(1).max(12),
  minute: z.union([z.literal(0), z.literal(15), z.literal(30), z.literal(45)]),
  period: z.union([z.literal("AM"), z.literal("PM")]),
});

const appointmentSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  phone: z.string().trim().min(6, "Please enter a valid phone number.").max(30),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date."),
  time: timeValueSchema,
  message: z.string().trim().min(1, "Please enter a message.").max(2000),
});

function timeToMinutes(time: z.infer<typeof timeValueSchema>) {
  const hour24 = (time.hour % 12) + (time.period === "PM" ? 12 : 0);
  return hour24 * 60 + time.minute;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = appointmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Please check your details and try again." },
      { status: 400 }
    );
  }

  const { name, phone, date, time, message } = parsed.data;
  const timeLabel = formatTimeValue(time);
  const timeMinutes = timeToMinutes(time);

  const rows = await sql`
    insert into appointments
      (name, phone, message, appointment_date, appointment_time_label, appointment_time_minutes)
    values
      (${name}, ${phone}, ${message}, ${date}, ${timeLabel}, ${timeMinutes})
    returning id
  `;

  // Fire-and-forget: don't await/block the response on email delivery, and
  // never let an email failure turn a successful booking into an error
  // response — the appointment is already safely in the database above.
  sendAppointmentEmail({ name, phone, date, timeLabel, message }).catch(() => {});

  return NextResponse.json({ success: true, id: rows[0]?.id });
}