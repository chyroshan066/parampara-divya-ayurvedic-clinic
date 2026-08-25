type AppointmentEmailInput = {
  name: string;
  phone: string;
  date: string; // "YYYY-MM-DD"
  timeLabel: string; // e.g. "10:30 AM"
  message: string;
};

/**
 * Sends a "new appointment booked" notification to the clinic's inbox.
 *
 * Uses a plain fetch() call against Resend's REST API directly, rather
 * than the `resend` npm SDK — the SDK's internal fetch call was
 * consistently failing with a network-level "Unable to fetch data. The
 * request could not be resolved." error (statusCode: null) on Vercel,
 * even though the same request succeeds fine as a raw HTTPS call.
 *
 * Fails silently (logs only) on purpose — a flaky email provider should
 * never cause the booking API to return an error to the visitor, since
 * the appointment itself is already safely stored in the database at
 * the point this is called.
 */
export async function sendAppointmentEmail(appointment: AppointmentEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "sendAppointmentEmail: RESEND_API_KEY is not set — skipping notification email."
    );
    return;
  }

  const notifyTo = process.env.NOTIFY_EMAIL;
  if (!notifyTo) {
    console.error(
      "sendAppointmentEmail: NOTIFY_EMAIL is not set — skipping notification email."
    );
    return;
  }

  // Resend's shared "onboarding@resend.dev" sender works immediately with
  // no domain setup, but only delivers to the email you signed up with —
  // fine for testing. Once your own domain is verified in the Resend
  // dashboard, set FROM_EMAIL (e.g. "Om Kapan Dental <appointments@omkapandentalktm.com.np>")
  // to send from your own domain to any address.
  const from = process.env.FROM_EMAIL || "Appointments <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: notifyTo,
        subject: `New appointment request — ${appointment.name}`,
        html: buildAppointmentEmailHtml(appointment),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "<no body>");
      console.error(
        `sendAppointmentEmail: Resend API returned ${res.status} ${res.statusText}:`,
        body
      );
    }
  } catch (err) {
    console.error("sendAppointmentEmail: failed to send notification email:", err);
  }
}

const BRAND_DARK = "#507b3a"; // primary (buttons, header, accents)
const BRAND_LIGHT = "#d9e3be"; // soft tint (backgrounds, borders)

/**
 * Builds the notification email as a table-based layout with inline styles.
 * Email clients (Gmail, Outlook, Apple Mail) don't reliably support
 * flexbox/grid or <style> blocks, so everything is deliberately old-school:
 * nested <table>s + inline CSS, which is the layout method that renders
 * consistently across all of them.
 */
function buildAppointmentEmailHtml(appointment: AppointmentEmailInput) {
  const formattedDate = formatDateLong(appointment.date);

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid ${BRAND_LIGHT}; width: 130px; vertical-align: top;">
        <span style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #7c8aa3;">${label}</span>
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid ${BRAND_LIGHT}; vertical-align: top;">
        <span style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: #1e2333; line-height: 1.5;">${value}</span>
      </td>
    </tr>`;

  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin: 0; padding: 0; background-color: ${BRAND_LIGHT};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND_LIGHT}; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 18px rgba(85, 61, 181, 0.12);">

            <!-- Header -->
            <tr>
              <td style="background-color: ${BRAND_DARK}; padding: 30px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 700; color: #ffffff;">Parampara Divya Ayurvedic</span>
                    </td>
                    <td align="right">
                      <span style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${BRAND_DARK}; background-color: ${BRAND_LIGHT}; padding: 6px 12px; border-radius: 999px;">New Booking</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Light blue accent strip -->
            <tr>
              <td style="height: 6px; background-color: ${BRAND_LIGHT};"></td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="padding: 32px 32px 8px 32px;">
                <span style="font-family: Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #1e2333;">New appointment request</span>
                <br />
                <span style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: #6b7690;">Someone just booked through the website contact form.</span>
              </td>
            </tr>

            <!-- Details card -->
            <tr>
              <td style="padding: 20px 32px 8px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fbfe; border: 1px solid ${BRAND_LIGHT}; border-radius: 14px; padding: 4px 20px;">
                  ${row("Name", escapeHtml(appointment.name))}
                  ${row("Phone", `<a href="tel:${escapeHtml(appointment.phone)}" style="color: ${BRAND_DARK}; text-decoration: none; font-weight: 600;">${escapeHtml(appointment.phone)}</a>`)}
                  ${row("Requested date", formattedDate)}
                  ${row("Requested time", escapeHtml(appointment.timeLabel))}
                </table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding: 20px 32px 8px 32px;">
                <span style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #7c8aa3;">Message</span>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 8px; background-color: #f7fbfe; border: 1px solid ${BRAND_LIGHT}; border-radius: 14px;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <span style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: #1e2333; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(appointment.message)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding: 28px 32px 32px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius: 10px; background-color: ${BRAND_DARK};">
                      <a href="tel:${escapeHtml(appointment.phone)}" style="display: inline-block; padding: 12px 24px; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none;">Call ${escapeHtml(appointment.name.split(" ")[0] || appointment.name)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #f7fbfe; border-top: 1px solid ${BRAND_LIGHT};">
                <span style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #8a94ab;">This is an automated notification from your website's booking form. Manage all requests from the admin panel.</span>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function formatDateLong(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(isoDate);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}