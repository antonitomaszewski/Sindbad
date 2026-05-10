'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '../../../logic/types/user';
import {
  changeUserEmail,
  changeUserPassword,
  isCurrentUserOAuth,
  updateUserProfile,
  updateProfileVisibility,
} from '../../../logic/lib/users';
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
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');
  const [isOAuthAccount, setIsOAuthAccount] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>(
    (user.profile_visibility as 'public' | 'private') || 'public'
  );
  const [accountData, setAccountData] = useState({
    email: user.email || '',
    currentPasswordForEmail: '',
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  useEffect(() => {
    const loadAuthType = async () => {
      const oauth = await isCurrentUserOAuth();
      setIsOAuthAccount(oauth);
    };

    loadAuthType();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Zaktualizuj profil (name, bio, avatar)
      await updateUserProfile(user.id, formData);
      
      // 2. Zaktualizuj certyfikaty
      await updateUserCertifications(user.id, selectedCertIds);

      // 3. Zaktualizuj widoczność profilu
      await updateProfileVisibility(user.id, profileVisibility);

      router.push(`/profil/${user.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Nie udało się zapisać zmian');
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailChange() {
    setAccountError('');
    setAccountSuccess('');
    setAccountLoading(true);

    try {
      await changeUserEmail(user.id, accountData.email, accountData.currentPasswordForEmail);
      setAccountSuccess('Email został zaktualizowany.');
      setAccountData((prev) => ({ ...prev, currentPasswordForEmail: '' }));
    } catch (err: any) {
      setAccountError(err.message || 'Nie udało się zmienić emaila');
    } finally {
      setAccountLoading(false);
    }
  }

  async function handlePasswordChange() {
    setAccountError('');
    setAccountSuccess('');
    setAccountLoading(true);

    try {
      await changeUserPassword(
        user.id,
        accountData.currentPassword,
        accountData.newPassword,
        accountData.newPasswordConfirm
      );
      setAccountSuccess('Hasło zostało zmienione.');
      setAccountData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      }));
    } catch (err: any) {
      setAccountError(err.message || 'Nie udało się zmienić hasła');
    } finally {
      setAccountLoading(false);
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

          {!isOAuthAccount && (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Dane logowania</h2>

              {accountError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {accountError}
                </div>
              )}

              {accountSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {accountSuccess}
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Zmiana emaila</h3>
                <input
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Nowy email"
                  disabled={accountLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <input
                  type="password"
                  value={accountData.currentPasswordForEmail}
                  onChange={(e) =>
                    setAccountData((prev) => ({ ...prev, currentPasswordForEmail: e.target.value }))
                  }
                  placeholder="Aktualne hasło"
                  disabled={accountLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={handleEmailChange}
                  disabled={accountLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Zmień email
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Zmiana hasła</h3>
                <input
                  type="password"
                  value={accountData.currentPassword}
                  onChange={(e) => setAccountData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Aktualne hasło"
                  disabled={accountLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <input
                  type="password"
                  value={accountData.newPassword}
                  onChange={(e) => setAccountData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Nowe hasło (min. 8 znaków)"
                  disabled={accountLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <input
                  type="password"
                  value={accountData.newPasswordConfirm}
                  onChange={(e) =>
                    setAccountData((prev) => ({ ...prev, newPasswordConfirm: e.target.value }))
                  }
                  placeholder="Potwierdź nowe hasło"
                  disabled={accountLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={accountLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Zmień hasło
                </button>
              </div>
            </div>
          )}

          {isOAuthAccount && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              Konto logowane przez OAuth. Zmiana emaila i hasła jest wyłączona.
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Widoczność profilu</h2>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="profile_visibility"
                  value="public"
                  checked={profileVisibility === 'public'}
                  onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private')}
                  disabled={loading}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-gray-700 font-medium">Publiczny</span>
                <span className="ml-2 text-sm text-gray-500">Twój profil widoczny dla wszystkich</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="profile_visibility"
                  value="private"
                  checked={profileVisibility === 'private'}
                  onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private')}
                  disabled={loading}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-gray-700 font-medium">Prywatny</span>
                <span className="ml-2 text-sm text-gray-500">Twój profil widoczny tylko dla Ciebie</span>
              </label>
            </div>
          </div>

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