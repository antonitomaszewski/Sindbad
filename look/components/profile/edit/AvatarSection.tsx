'use client';

import { useState } from 'react';
import type { User } from '../../../../logic/types/user';
import { deleteUserAvatar } from '../../../../logic/lib/users';
import { validateAvatar } from '../../../../logic/lib/validation';

interface Props {
  user: User;
  formData: { name: string; bio: string; avatar: File | null };
  setFormData: (data: any) => void;
  loading: boolean;
}

export default function AvatarSection({ user, formData, setFormData, loading }: Props) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateAvatar(file);
    if (error) {
      setAvatarError(error);
      e.target.value = '';
      return;
    }

    setAvatarError('');
    setFormData({ ...formData, avatar: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleDeleteAvatar() {
    if (!confirm('Czy na pewno chcesz usunąć zdjęcie profilowe?')) return;

    setDeleting(true);
    try {
      await deleteUserAvatar(user.id);
      setAvatarPreview(null);
      setFormData({ ...formData, avatar: null });
      alert('Zdjęcie zostało usunięte');
    } catch (err: any) {
      alert(err.message || 'Nie udało się usunąć zdjęcia');
    } finally {
      setDeleting(false);
    }
  }

  const currentAvatar = avatarPreview || (user.avatar 
    ? `http://localhost:8090/api/files/users/${user.id}/${user.avatar}` 
    : null);

  const initials = (formData.name || user.email).charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Zdjęcie profilowe</h2>
      
      <div className="flex items-center gap-6">
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-main-soft flex items-center justify-center border-4 border-gray-100">
            <span className="text-3xl font-bold text-main">{initials}</span>
          </div>
        )}

        <div className="flex-1 space-y-3">
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={loading || deleting}
            className="hidden"
          />
          <div className="flex gap-3">
            <label
              htmlFor="avatar"
              className={`px-4 py-2 bg-main text-white rounded-lg font-semibold hover-bg-main transition cursor-pointer text-sm ${
                (loading || deleting) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Wybierz zdjęcie
            </label>
            {(currentAvatar || user.avatar) && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={loading || deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Usuwanie...' : 'Usuń zdjęcie'}
              </button>
            )}
          </div>
          {avatarError
            ? <p className="text-xs text-red-600">{avatarError}</p>
            : <p className="text-xs text-gray-500">Maksymalny rozmiar: 5MB. Format: JPG, PNG, GIF</p>
          }
        </div>
      </div>
    </div>
  );
}