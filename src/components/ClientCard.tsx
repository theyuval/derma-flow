'use client';

import Link from 'next/link';

interface ClientProps {
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

export default function ClientCard({ client }: ClientProps) {
  const { id, name, email, phone, photo_url, last_appointment, next_appointment } = client;
  
  return (
    <Link
      href={`/clients/${id}`}
      className="block hover:bg-gray-50"
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            {photo_url ? (
              <img
                className="h-12 w-12 rounded-full mr-4"
                src={photo_url}
                alt={`${name}'s profile`}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <span className="text-indigo-800 font-medium text-lg">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{name}</h3>
              <p className="text-gray-600">{email}</p>
              {phone && <p className="text-gray-600">{phone}</p>}
            </div>
          </div>
        </div>
        
        {(next_appointment || last_appointment) && (
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
            <div className="text-sm">
              {next_appointment && (
                <p className="mb-1">
                  <span className="font-medium">Next Appointment:</span> {new Date(next_appointment).toLocaleString()}
                </p>
              )}
              {last_appointment && (
                <p>
                  <span className="font-medium">Last Appointment:</span> {new Date(last_appointment).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
} 