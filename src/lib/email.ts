import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

export async function sendAppointmentReminder(email: string, appointment: { treatment: string; date_time: string }) {
  return sendEmail({
    to: email,
    subject: 'Appointment Reminder',
    html: `<p>Your appointment for <strong>${appointment.treatment}</strong> is on <strong>${new Date(appointment.date_time).toLocaleString()}</strong>.</p>`,
  });
} 