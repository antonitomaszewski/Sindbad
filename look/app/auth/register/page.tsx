'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '../../../../logic/lib/users';
import OAuthButton from '../../../components/auth/OAuthButton';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== passwordConfirm) {
      setError('Hasła nie są identyczne');
      return;
    }

    if (password.length < 8) {
      setError('Hasło musi mieć minimum 8 znaków');
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password, passwordConfirm, name || undefined);
      const authData = await loginUser(email, password);
      const userId = authData?.record?.id;

      if (!userId) {
        throw new Error('Nie udało się pobrać ID użytkownika po logowaniu.');
      }

      router.push(`/profil/${userId}?registered=1`);
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'Błąd rejestracji. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dołącz do Sindbad</h1>
          <p className="text-gray-600">Stwórz konto i zacznij pływać</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Imię i nazwisko
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus-ring-main focus:border-transparent transition"
              placeholder="Jan Kowalski"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus-ring-main focus:border-transparent transition"
              placeholder="twoj@email.pl"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus-ring-main focus:border-transparent transition"
              placeholder="Minimum 8 znaków"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
              Potwierdź hasło
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus-ring-main focus:border-transparent transition"
              placeholder="Powtórz hasło"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-main text-white py-3 px-4 rounded-lg font-semibold hover-bg-main disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
          >
            {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Lub kontynuuj z</span>
            </div>
          </div>

          <div className="mt-4">
            <OAuthButton
              provider="google"
              onSuccess={() => router.push('/profil')}
              onError={(err) => setError(err)}
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Masz już konto?{' '}
            <Link href="/logowanie" className="text-main hover-text-main font-medium hover:underline">
              Zaloguj się
            </Link>
          </p>
        </div>

        <p className="mt-6 text-xs text-center text-gray-500">
          Rejestrując się, akceptujesz nasze warunki korzystania z serwisu
        </p>
      </div>
    </div>
  );
}