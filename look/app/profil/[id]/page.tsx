// strona wyświetlania się profilu
// w więszkości oparta na lib/bookings czyli naszych rezerwacjach, kontaktach o nie opartych
// rejsach, które organizujemy
// dodatkowo z prawej strony mamy wyswietlane opinie z rejsów które organizowaliśmy
// oraz powiadomienia na rejsy w przyszłości
"use client";
import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { isCurrentServerUser, getCurrentUser, canAccessProfile } from '../../../../logic/lib/users';
import { getTripsByOrganizer } from '../../../../logic/lib/offers';
import {
  getUserContacts,
  getUserBookingsWithOffers,
} from '../../../../logic/lib/bookings';
import type { BookingWithOffer, UserContact } from '../../../../logic/types/booking';
import UserProfile from '../../../components/profile/UserProfile';
import { LoadingState } from '../../../components/common/LoadingState';
import { NotFoundState } from '../../../components/common/NotFoundState';
import { useUser } from '../../../hooks/useUser';
import type { Trip } from '@/logic/types/offer';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilPage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const { user, loading: userLoading, error: userError } = useUser(id);
  const [organizedTrips, setOrganizedTrips] = useState<Trip[]>([]);
  const [myBookings, setMyBookings] = useState<BookingWithOffer[]>([]);
  const [userContacts, setUserContacts] = useState<UserContact[]>([]);
  const [commonContactIds, setCommonContactIds] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Sprawdź dostęp do profilu
        const currentUser = getCurrentUser();
        const access = await canAccessProfile(id, currentUser?.id);
        setHasAccess(access);

        if (!access) {
          setDataLoading(false);
          return;
        }

        const [organized, bookings, contacts] = await Promise.all([
          getTripsByOrganizer(id),
          getUserBookingsWithOffers(id),
          getUserContacts(id),
        ]);

        const viewerContacts =
          currentUser?.id && currentUser.id !== id
            ? await getUserContacts(currentUser.id)
            : [];

        const viewerContactIdSet = new Set(viewerContacts.map((contact) => contact.userId));
        const commonIds = contacts
          .map((contact) => contact.userId)
          .filter((contactId) => viewerContactIdSet.has(contactId));

        setOrganizedTrips(organized);
        setMyBookings(bookings);
        setUserContacts(contacts);
        setCommonContactIds(commonIds);
      } catch (e) {
        console.warn('ProfilPage data load failed', e);
      } finally {
        setDataLoading(false);
      }
    };

    loadProfileData();
  }, [id]);

  if (userLoading || dataLoading) {
    return <LoadingState message="Ładowanie profilu..." />;
  }

  if (userError || !user || hasAccess === false) {
    return (
      <NotFoundState
        title="404"
        message="Profil nie jest dostępny"
        description="Nie masz dostępu do tego profilu lub profil nie istnieje."
        backUrl="/kalendarz"
        backText="Powrót do kalendarza"
      />
    );
  }

  const isOwnProfile = isCurrentServerUser(user);
  const registrationSuccess = searchParams.get('registered') === '1';

  return (
    <UserProfile
      user={user}
      organizedTrips={organizedTrips}
      isOwnProfile={isOwnProfile}
      myBookings={myBookings}
      userContacts={userContacts}
      commonContactIds={commonContactIds}
      successMessage={registrationSuccess ? 'Konto utworzone i zalogowano pomyślnie. Sprawdź skrzynkę mailową i potwierdź adres email.' : undefined}
    />
  );
}