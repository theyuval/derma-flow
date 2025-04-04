'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface SessionNotesProps {
  clientId: string;
  appointmentId: string;
  existingNote?: {
    id: string;
    notes: string;
    consent_form_url?: string;
    created_at: string;
  };
}

export default function SessionNotes({ clientId, appointmentId, existingNote }: SessionNotesProps) {
  const [notes, setNotes] = useState(existingNote?.notes || '');
  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [consentFileName, setConsentFileName] = useState(
    existingNote?.consent_form_url ? 'Consent form already uploaded' : ''
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setConsentFile(file);
    setConsentFileName(file ? file.name : '');
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    
    try {
      // If there's a consent form, upload it to Cloudinary
      let consentFormUrl = existingNote?.consent_form_url;
      if (consentFile) {
        consentFormUrl = await uploadToCloudinary(consentFile);
      }
      
      if (existingNote) {
        // Update existing note
        const { error } = await supabase
          .from('session_notes')
          .update({
            notes,
            consent_form_url: consentFormUrl,
          })
          .eq('id', existingNote.id);
          
        if (error) throw error;
      } else {
        // Create new note
        const { error } = await supabase
          .from('session_notes')
          .insert({
            client_id: clientId,
            appointment_id: appointmentId,
            notes,
            consent_form_url: consentFormUrl,
          });
          
        if (error) throw error;
      }
      
      setSaved(true);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setConsentFile(null);
      
    } catch (error) {
      console.error('Error saving session notes:', error);
      alert('Failed to save session notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Session Notes & Consent Form</h3>
      
      <div className="mb-6">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Treatment Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Document treatment details, client reactions, products used, etc."
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Consent Form (PDF)
        </label>
        <div className="mt-1 flex items-center">
          <div
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500"
          >
            <span className="block text-gray-500 text-sm">
              {consentFileName || existingNote?.consent_form_url ? consentFileName || 'Consent form already uploaded' : 'No file selected'}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="ml-3 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Browse
          </button>
        </div>
        {existingNote?.consent_form_url && (
          <div className="mt-2">
            <a
              href={existingNote.consent_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-900 text-sm inline-flex items-center"
            >
              View current consent form
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Notes'}
        </button>
        
        {saved && (
          <span className="text-green-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Saved successfully
          </span>
        )}
      </div>
    </form>
  );
} 