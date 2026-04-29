// mam tu funkcję która zwraca widok strony. poszczególne elementy tego widoku
// będą zaimportowane z folderu komponentów.
import { getUser } from '../../../../logic/lib/users';
import { getTripsByOrganizer, getTripsByParticipant } from '../../../../logic/lib/offers';
import UserProfile from '../../../components/profile/UserProfile';

export default async function ProfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Użytkownik nie znaleziony</h1>
      </div>
    );
  }

  let organizedTrips : any = [];
  let participatedTrips : any = [];

  try {
    organizedTrips = await getTripsByOrganizer(id);
  } catch (e) {
    console.warn('getTripsByOrganizer failed', e);
    organizedTrips = [];
  }

  try {
    participatedTrips = await getTripsByParticipant(id);
  } catch (e) {
    console.warn('getTripsByParticipant failed', e);
    participatedTrips = [];
  }

  return <UserProfile user={user} organizedTrips={organizedTrips} participatedTrips={participatedTrips} />;
}