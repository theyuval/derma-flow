import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminder(email: string, appointment: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Appointment Reminder',
      text: `Your appointment for ${appointment.treatment} is on ${new Date(appointment.date_time).toLocaleString()}.`,
      html: `<p>Your appointment for <strong>${appointment.treatment}</strong> is on <strong>${new Date(appointment.date_time).toLocaleString()}</strong>.</p>`,
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