'use client';
import { use } from 'react';
import Link from 'next/link';
import { useOffer } from '@/look/hooks/useOffer';
import { useUser } from '@/look/hooks/useUser';
import { OfferHeader } from '@/look/components/offer/OfferHeader';
import { OfferDescription } from '@/look/components/offer/OfferDescription';
import { OfferOrganizer } from '@/look/components/offer/OfferOrganizer';
import { OfferActions } from '@/look/components/offer/OfferActions';
import { OfferGallery } from '@/look/components/offer/OfferGallery';
import { LoadingState } from '@/look/components/common/LoadingState';
import { NotFoundState } from '@/look/components/common/NotFoundState';
import { OFFER_MESSAGES } from '@/look/constants/offer';

interface OfferPageProps {
  params: Promise<{ id: string }>;
}

export default function OfertaPage({ params }: OfferPageProps) {
  const { id } = use(params);
  const { offer, loading, error } = useOffer(id);
  const { user: organizer, loading: organizerLoading } = useUser(offer?.organizer_id);

  const handleReservation = () => {
    alert(OFFER_MESSAGES.RESERVATION_ALERT);
  };

  const handleContact = () => {
    alert(OFFER_MESSAGES.CONTACT_ALERT);
  };

  if (loading) {
    return <LoadingState message={OFFER_MESSAGES.LOADING} />;
  }

  if (error || !offer) {
    return (
      <NotFoundState
        title="404"
        message={OFFER_MESSAGES.NOT_FOUND}
        description={OFFER_MESSAGES.NOT_FOUND_DESCRIPTION}
        backUrl="/kalendarz"
        backText="Powrót do kalendarza"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <OfferHeader
          title={offer.title}
          location={offer.location}
          price={offer.price}
          dateFrom={offer.date_from}
          dateTo={offer.date_to}
        />

        <OfferDescription description={offer.description} />

        <OfferGallery offerId={offer.id} />

        <OfferOrganizer
          organizerId={offer.organizer_id}
          organizerName={organizer?.name}
          isLoading={organizerLoading}
        />

        <OfferActions
          onReservation={handleReservation}
          onContact={handleContact}
        />

        <div className="mt-6 text-center">
          <Link 
            href="/kalendarz"
            className="text-main hover:text-green-dark font-medium"
          >
            {OFFER_MESSAGES.BACK_TO_CALENDAR}
          </Link>
        </div>
      </div>
    </div>
  );
}