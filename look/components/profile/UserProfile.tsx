import UserHeader from './UserHeader';
import UserBio from './UserBio';
import TripHistory from './TripHistory';
import Certifications from './Certifications';
import MyBookingsList from '../booking/MyBookingsList';
import { TripAlertsList } from '../trip-alerts/TripAlertsList';
import { OrganizerReviewsSummary } from './OrganizerReviewsSummary';
import { SailedWithSection } from './SailedWithSection';
import type { User } from '../../../logic/types/user';
import type { BookingWithOffer, UserContact } from '../../../logic/types/booking';
import Link from 'next/link';

export default function UserProfile({
  user,
  organizedTrips,
  participatedTrips,
  isOwnProfile = false,
  myBookings = [],
  userContacts = [],
  commonContactIds = [],
  successMessage,
}: {
  user: User;
  organizedTrips: { id: string; title?: string; date?: string }[];
  participatedTrips: { id: string; title?: string; date?: string }[];
  isOwnProfile?: boolean;
  myBookings?: BookingWithOffer[];
  userContacts?: UserContact[];
  commonContactIds?: string[];
  successMessage?: string;
}) {

  return (
    <div className="max-w-[1100px] mx-auto p-8 space-y-8">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <UserHeader user={user} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <UserBio bio={user.bio} />

          <SailedWithSection contacts={userContacts} commonContactIds={commonContactIds} />

          <TripHistory title="Rejsy organizowane" trips={organizedTrips} />
          {/* <TripHistory title="Rejsy jako załogant" trips={participatedTrips} /> */}
          {isOwnProfile && <MyBookingsList bookings={myBookings} />}
        </div>

        <aside className="space-y-6">
          <Certifications certifications={user.certifications ?? []} />
          <OrganizerReviewsSummary organizerId={user.id} />
          {isOwnProfile && <TripAlertsList />}
        </aside>
      </div>

      {isOwnProfile && (
        <Link
          href={`/profil/${user.id}/edytuj`} // Zmień z /profil/edycja
          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
        >
          Edytuj profil
        </Link>
      )}
    </div>
  );
}