import UserHeader from './UserHeader';
import UserBio from './UserBio';
import TripHistory from './TripHistory';
import Certifications from './Certifications';
import type { User } from '../../../logic/types/user';

export default function UserProfile({
  user,
  organizedTrips,
  participatedTrips,
}: {
  user: User;
  organizedTrips: { id: string; title?: string; date?: string }[];
  participatedTrips: { id: string; title?: string; date?: string }[];
}) {
  return (
    <div className="max-w-[1100px] mx-auto p-8 space-y-8">
      <UserHeader user={user} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <UserBio bio={user.bio} />

          <TripHistory title="Rejsy organizowane" trips={organizedTrips} />
          <TripHistory title="Rejsy jako załogant" trips={participatedTrips} />
        </div>

        <aside className="space-y-6">
          <Certifications certifications={user.certifications ?? []} />
        </aside>
      </div>
    </div>
  );
}