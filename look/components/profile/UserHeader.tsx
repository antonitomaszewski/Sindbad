import type { User } from '../../../logic/types/user';
import {getUserAvatar} from '../../../logic/lib/images';

export default function UserHeader({ user }: { user: User }) {
  const avatarUrl = getUserAvatar(user);

  return (
    <header className="flex items-center gap-6">
      <div className="w-28 h-28 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={user?.name ?? 'avatar'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Brak zdjęcia
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{user.name}</h1>
        </div>
      </div>
    </header>
  );
}