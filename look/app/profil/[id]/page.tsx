"use client";
import { use, useEffect, useState } from 'react';
import { isCurrentServerUser } from '../../../../logic/lib/users';
import { getTripsByOrganizer, getTripsByParticipant } from '../../../../logic/lib/offers';
import { getUserBookingsWithOffers } from '../../../../logic/lib/bookings';
import type { BookingWithOffer } from '../../../../logic/types/booking';
import UserProfile from '../../../components/profile/UserProfile';
import { LoadingState } from '../../../components/common/LoadingState';
import { NotFoundState } from '../../../components/common/NotFoundState';
import { useUser } from '../../../hooks/useUser';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

type Trip = { id: string; title?: string; date?: string };

export default function ProfilPage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const { user, loading: userLoading, error: userError } = useUser(id);
  const [organizedTrips, setOrganizedTrips] = useState<Trip[]>([]);
  const [participatedTrips, setParticipatedTrips] = useState<Trip[]>([]);
  const [myBookings, setMyBookings] = useState<BookingWithOffer[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [organized, participated, bookings] = await Promise.all([
          getTripsByOrganizer(id),
          getTripsByParticipant(id),
          getUserBookingsWithOffers(id),
        ]);

        setOrganizedTrips(organized);
        setParticipatedTrips(participated);
        setMyBookings(bookings);
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

  if (userError || !user) {
    return (
      <NotFoundState
        title="404"
        message="Użytkownik nie znaleziony"
        description="Nie udało się odnaleźć profilu użytkownika."
        backUrl="/kalendarz"
        backText="Powrót do kalendarza"
      />
    );
  }

  const isOwnProfile = isCurrentServerUser(user);

  return (
    <UserProfile
      user={user}
      organizedTrips={organizedTrips}
      participatedTrips={participatedTrips}
      isOwnProfile={isOwnProfile}
      myBookings={myBookings}
    />
  );
}