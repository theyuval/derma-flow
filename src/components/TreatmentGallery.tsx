'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface TreatmentGalleryProps {
  clientId: string;
  existingPhotos?: {
    id: string;
    before_url: string;
    after_url: string;
    treatment_date: string;
    notes?: string;
  }[];
}

export default function TreatmentGallery({ clientId, existingPhotos = [] }: TreatmentGalleryProps) {
  const [loading, setLoading] = useState(false);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [treatmentDate, setTreatmentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  
  const handleBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBeforeFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBeforePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBeforePreview(null);
    }
  };
  
  const handleAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAfterFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAfterPreview(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!beforeFile || !afterFile || !treatmentDate) {
      alert('Please select both before and after images and set a treatment date.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload images to Cloudinary
      const beforeUrl = await uploadToCloudinary(beforeFile);
      const afterUrl = await uploadToCloudinary(afterFile);
      
      // Save to Supabase
      const { error } = await supabase.from('treatment_photos').insert({
        client_id: clientId,
        before_url: beforeUrl,
        after_url: afterUrl,
        treatment_date: treatmentDate,
        notes: notes || null,
      });
      
      if (error) throw error;
      
      // Reset form
      setBeforeFile(null);
      setAfterFile(null);
      setBeforePreview(null);
      setAfterPreview(null);
      setTreatmentDate('');
      setNotes('');
      if (beforeInputRef.current) beforeInputRef.current.value = '';
      if (afterInputRef.current) afterInputRef.current.value = '';
      
      alert('Photos uploaded successfully!');
      // Could use a better notification system in production
      
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Treatment Photos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Before Treatment
            </label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-48">
              {beforePreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={beforePreview}
                    alt="Before preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleBeforeChange}
                ref={beforeInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              After Treatment
            </label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-48">
              {afterPreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={afterPreview}
                    alt="After preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAfterChange}
                ref={afterInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="treatmentDate" className="block text-sm font-medium text-gray-700 mb-1">
            Treatment Date
          </label>
          <input
            type="date"
            id="treatmentDate"
            value={treatmentDate}
            onChange={(e) => setTreatmentDate(e.target.value)}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe the treatment, results, or observations"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !beforeFile || !afterFile}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Treatment Photos'}
        </button>
      </form>
      
      {/* Existing Photos Gallery */}
      {existingPhotos.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Treatment History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {existingPhotos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative h-48">
                    <Image
                      src={photo.before_url}
                      alt="Before treatment"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                      Before
                    </div>
                  </div>
                  <div className="relative h-48">
                    <Image
                      src={photo.after_url}
                      alt="After treatment"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                      After
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-sm">
                    {new Date(photo.treatment_date).toLocaleDateString()}
                  </p>
                  {photo.notes && <p className="mt-2 text-gray-700">{photo.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 