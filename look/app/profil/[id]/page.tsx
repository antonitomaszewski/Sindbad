// mam tu funkcję która zwraca widok strony. poszczególne elementy tego widoku
// będą zaimportowane z folderu komponentów.
import { getUser } from '../../../../logic/lib/users';
import { getTripsByOrganizer, getTripsByParticipant } from '../../../../logic/lib/offers';
import { getUserBookingsWithOffers } from '../../../../logic/lib/bookings';
import { getServerUser } from '../../../../logic/lib/users.server';
import UserProfile from '../../../components/profile/UserProfile';

export default async function ProfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, currentUser] = await Promise.all([getUser(id), getServerUser()]);
  
  console.log('[ProfilPage] DEBUG:', {
    id,
    idType: typeof id,
    currentUserId: currentUser?.id,
    currentUserIdType: typeof currentUser?.id,
    isOwnProfile: currentUser?.id === id,
    currentUser: currentUser ? { id: currentUser.id, email: currentUser.email } : null,
  });
  
  const isOwnProfile = currentUser?.id === id;

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Użytkownik nie znaleziony</h1>
      </div>
    );
  }

  let organizedTrips: any = [];
  let participatedTrips: any = [];
  let myBookings: any = [];

  try {
    organizedTrips = await getTripsByOrganizer(id);
  } catch (e) {
    console.warn('getTripsByOrganizer failed', e);
  }

  try {
    participatedTrips = await getTripsByParticipant(id);
  } catch (e) {
    console.warn('getTripsByParticipant failed', e);
  }

  if (isOwnProfile) {
    try {
      myBookings = await getUserBookingsWithOffers(id);
    } catch (e) {
      console.warn('getUserBookingsWithOffers failed', e);
    }
  }

  return <UserProfile user={user} organizedTrips={organizedTrips} participatedTrips={participatedTrips} isOwnProfile={isOwnProfile} myBookings={myBookings} />;
}