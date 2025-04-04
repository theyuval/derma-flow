'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// Import sendReminder but don't require it
// import { sendReminder } from '@/lib/sendEmail';

interface AppointmentFormProps {
  clientId: string;
  _clientEmail: string;  // Prefixed with underscore to indicate it's not used
  _clientName: string;   // Prefixed with underscore to indicate it's not used
}

export default function AppointmentForm({ clientId, _clientEmail, _clientName }: AppointmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dateTime: '',
    treatment: '',
    duration: 60, // default duration in minutes
    notes: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Insert appointment into Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          client_id: clientId,
          date_time: formData.dateTime,
          treatment: formData.treatment,
          duration: formData.duration,
          notes: formData.notes,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Email functionality commented out for now
      /* 
      try {
        await sendReminder(clientEmail, {
          treatment: formData.treatment,
          date_time: formData.dateTime,
          client_name: clientName
        });
      } catch (emailError) {
        console.error('Email sending failed, but appointment was created:', emailError);
      }
      */
      
      // Redirect to appointment details
      router.push(`/appointments/${data.id}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div>
        <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">
          Date & Time
        </label>
        <input
          type="datetime-local"
          id="dateTime"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">
          Treatment
        </label>
        <input
          type="text"
          id="treatment"
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          required
          placeholder="e.g., Botox, Fillers, Microdermabrasion"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <select
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1 hour 30 minutes</option>
          <option value={120}>2 hours</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any additional information or preparation instructions"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </form>
  );
} 