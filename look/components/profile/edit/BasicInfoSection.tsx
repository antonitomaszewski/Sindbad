// używany w profil/id/edytuj
// mamy tu fiormularz do uzupełnienia z informacjami o nas

'use client';

import type { ValidationErrors } from '../../../../logic/types/form';

interface Props {
  formData: { name: string; bio: string; avatar: File | null };
  setFormData: (data: any) => void;
  loading: boolean;
  errors?: ValidationErrors;
}

const MAX_BIO_LENGTH = 1000;

export default function BasicInfoSection({ formData, setFormData, loading, errors }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Podstawowe informacje</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Imię i nazwisko
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Jan Kowalski"
          disabled={loading}
          className={`w-full px-4 py-2 border rounded-lg focus-ring-main focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${errors?.name ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors?.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          O mnie
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Podpowiedź: opisz swoje doświadczenie, styl pływania oraz akweny, na których pływałeś lub chcesz pływać.
        </p>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={6}
          maxLength={MAX_BIO_LENGTH}
          placeholder="Np. 5 lat na Bałtyku i Adriatyku, styl: chill/regatowy, najchętniej Mazury i Chorwacja."
          disabled={loading}
          className={`w-full px-4 py-2 border rounded-lg focus-ring-main focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${errors?.bio ? 'border-red-400' : 'border-gray-300'}`}
        />
        <div className="mt-1 flex justify-between">
          {errors?.bio
            ? <p className="text-xs text-red-600">{errors.bio}</p>
            : <span />}
          <p className="text-xs text-gray-500">{formData.bio.length} / {MAX_BIO_LENGTH} znaków</p>
        </div>
      </div>
    </div>
  );
}