'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-indigo-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          DermaFlow
        </Link>
        
        <div className="space-x-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-white hover:text-indigo-200">
                    Dashboard
                  </Link>
                  <Link href="/clients" className="text-white hover:text-indigo-200">
                    Clients
                  </Link>
                  <Link href="/appointments" className="text-white hover:text-indigo-200">
                    Appointments
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-white hover:text-indigo-200">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100">
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 