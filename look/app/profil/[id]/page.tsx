"use client";
import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { isCurrentServerUser, getCurrentUser, canAccessProfile } from '../../../../logic/lib/users';
import { getTripsByOrganizer, getTripsByParticipant } from '../../../../logic/lib/offers';
import {
  getBookingsOrganizers,
  getBookingsParticipants,
  getUserConfirmedBookings,
  getUserContacts,
  getUserBookingsWithOffers,
} from '../../../../logic/lib/bookings';
import type { BookingWithOffer, UserContact } from '../../../../logic/types/booking';
import UserProfile from '../../../components/profile/UserProfile';
import { LoadingState } from '../../../components/common/LoadingState';
import { NotFoundState } from '../../../components/common/NotFoundState';
import { useUser } from '../../../hooks/useUser';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

type Trip = { id: string; title?: string; date_from?: string, date_to?: string };

export default function ProfilPage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const { user, loading: userLoading, error: userError } = useUser(id);
  const [organizedTrips, setOrganizedTrips] = useState<Trip[]>([]);
  const [participatedTrips, setParticipatedTrips] = useState<Trip[]>([]);
  const [myBookings, setMyBookings] = useState<BookingWithOffer[]>([]);
  const [userContacts, setUserContacts] = useState<UserContact[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    (window as any).debugContacts = {
      getUserConfirmedBookings,
      getBookingsOrganizers,
      getBookingsParticipants,
      getUserContacts,
      run: async (userId: string) => {
        const bookings = await getUserConfirmedBookings(userId);
        const organizers = await getBookingsOrganizers(bookings);
        const participants = await getBookingsParticipants(bookings);
        const contacts = await getUserContacts(userId);

        return {
          bookings,
          organizers: Array.from(organizers),
          participants: Array.from(participants),
          contacts,
        };
      },
    };

    return () => {
      delete (window as any).debugContacts;
    };
  }, []);

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

        const [organized, participated, bookings, contacts] = await Promise.all([
          getTripsByOrganizer(id),
          getTripsByParticipant(id),
          getUserBookingsWithOffers(id),
          getUserContacts(id),
        ]);

        setOrganizedTrips(organized);
        setParticipatedTrips(participated);
        setMyBookings(bookings);
        setUserContacts(contacts);
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

  if (hasAccess === null) {
    return <LoadingState message="Ładowanie profilu..." />;
  }

  const isOwnProfile = isCurrentServerUser(user);
  const registrationSuccess = searchParams.get('registered') === '1';

  return (
    <UserProfile
      user={user}
      organizedTrips={organizedTrips}
      participatedTrips={participatedTrips}
      isOwnProfile={isOwnProfile}
      myBookings={myBookings}
      userContacts={userContacts}
      successMessage={registrationSuccess ? 'Konto utworzone i zalogowano pomyślnie. Sprawdź skrzynkę mailową i potwierdź adres email.' : undefined}
    />
  );
}