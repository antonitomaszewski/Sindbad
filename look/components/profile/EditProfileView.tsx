'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '../../../logic/types/user';
import { updateUserProfile } from '../../../logic/lib/users';
import { updateUserCertifications, type Certification } from '../../../logic/lib/certifications';
import AvatarSection from './edit/AvatarSection';
import BasicInfoSection from './edit/BasicInfoSection';
import CertificationsSection from './edit/CertificationsSection';

interface Props {
  user: User;
  availableCertifications: Certification[];
  userCertificationIds: string[];
}

export default function EditProfileView({ 
  user, 
  availableCertifications,
  userCertificationIds 
}: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    avatar: null as File | null,
  });
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(userCertificationIds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Zaktualizuj profil (name, bio, avatar)
      await updateUserProfile(user.id, formData);
      
      // 2. Zaktualizuj certyfikaty
      await updateUserCertifications(user.id, selectedCertIds);

      router.push(`/profil/${user.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Nie udało się zapisać zmian');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edytuj profil</h1>
          <p className="text-gray-600">Zaktualizuj swoje dane</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AvatarSection 
            user={user} 
            formData={formData} 
            setFormData={setFormData} 
            loading={loading} 
          />
          
          <BasicInfoSection 
            formData={formData} 
            setFormData={setFormData} 
            loading={loading} 
          />

          <CertificationsSection
            selectedIds={selectedCertIds}
            availableCertifications={availableCertifications}
            onChange={setSelectedCertIds}
            disabled={loading}
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push(`/profil/${user.id}`)}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}