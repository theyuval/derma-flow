'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photo_url?: string;
    last_appointment?: string;
    next_appointment?: string;
  };
}

export default function ClientCard({ client }: ClientCardProps) {
  const { id, name, email, phone, photo_url, last_appointment, next_appointment } = client;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          {photo_url ? (
            <Image
              src={photo_url}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-600">{email}</p>
          {phone && <p className="text-gray-600">{phone}</p>}
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        {next_appointment && (
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-500">Next Appointment:</span>
            <p className="text-indigo-600">{new Date(next_appointment).toLocaleDateString()}</p>
          </div>
        )}
        
        {last_appointment && (
          <div>
            <span className="text-sm font-medium text-gray-500">Last Appointment:</span>
            <p>{new Date(last_appointment).toLocaleDateString()}</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t flex justify-between">
        <Link
          href={`/clients/${id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View Profile
        </Link>
        
        <Link
          href={`/appointments/new?client=${id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
} 