import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface Appointment {
  treatment: string;
  date_time: string;
  [key: string]: any;
}

export async function sendReminder(email: string, appointment: Appointment) {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM || 'your-email@example.com', // Should be verified sender in SendGrid
    subject: 'Appointment Reminder',
    text: `Your appointment for ${appointment.treatment} is on ${new Date(appointment.date_time).toLocaleString()}.`,
    html: `<p>Your appointment for <strong>${appointment.treatment}</strong> is on <strong>${new Date(appointment.date_time).toLocaleString()}</strong>.</p>`,
  };
  
  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
} 