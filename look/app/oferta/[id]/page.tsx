'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useOffer } from '@/look/hooks/useOffer';
import { useUser } from '@/look/hooks/useUser';
import { OfferHeader } from '@/look/components/offer/OfferHeader';
import { OfferDescription } from '@/look/components/offer/OfferDescription';
import { OfferOrganizer } from '@/look/components/offer/OfferOrganizer';
import { OfferActions } from '@/look/components/offer/OfferActions';
import { OfferGallery } from '@/look/components/offer/OfferGallery';
import { OfferParticipants } from '@/look/components/offer/OfferParticipants';
import { CreateTripAlertButton } from '@/look/components/trip-alerts/CreateTripAlertButton';
import { LoadingState } from '@/look/components/common/LoadingState';
import { NotFoundState } from '@/look/components/common/NotFoundState';
import { OFFER_MESSAGES } from '@/look/constants/offer';
import BookingModal from '@/look/components/booking/BookingModal';
import QuestionModal from '@/look/components/offer/QuestionModal';
import { BookingsPanel } from '@/look/components/booking/BookingsPanel';
import { isCurrentUserOrganizer } from '@/logic/lib/offers';
import {
  canViewParticipants,
  getConfirmedParticipants,
} from '@/logic/lib/bookings';
import type { OfferParticipant } from '@/logic/types/booking';

interface OfferPageProps {
  params: Promise<{ id: string }>;
}

export default function OfertaPage({ params }: OfferPageProps) {
  const { id } = use(params);
  const { offer, loading, error } = useOffer(id);
  const { user: organizer, loading: organizerLoading } = useUser(offer?.organizer_id);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionSent, setQuestionSent] = useState(false);
  const [participants, setParticipants] = useState<OfferParticipant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const handleReservation = () => {
    if (offer?.seats_available !== undefined && offer.seats_available <= 0) {
      return;
    }
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    alert('Rezerwacja wysłana!');
  };

  const handleContact = () => {
    setQuestionSent(false);
    setShowQuestionModal(true);
  };

  const handleQuestionSuccess = () => {
    setShowQuestionModal(false);
    setQuestionSent(true);
  };

  const resetParticipants = () => {
    setShowParticipants(false);
    setParticipants([]);
  };

  useEffect(() => {
    if (!offer) {
      resetParticipants();
      return;
    }

    let isCancelled = false;

    const loadParticipants = async () => {
      setParticipantsLoading(true);

      try {
        const canView = await canViewParticipants(offer.id);

        if (isCancelled) return;

        if (!canView) {
          resetParticipants();
          return;
        }

        const data = await getConfirmedParticipants(offer.id);
        if (isCancelled) return;

        setShowParticipants(true);
        setParticipants(data);
      } catch (err) {
        console.warn('loadParticipants error:', err);
        if (!isCancelled) {
          resetParticipants();
        }
      } finally {
        if (!isCancelled) {
          setParticipantsLoading(false);
        }
      }
    };

    loadParticipants();

    return () => {
      isCancelled = true;
    };
  }, [offer]);

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

  // Tutaj offer na pewno istnieje
  const isOrganizer = isCurrentUserOrganizer(offer);
  const canReserve = (offer.seats_available ?? 1) > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <OfferHeader
          title={offer.title}
          location={offer.location || ''}
          price={`${offer.price_per_person || 0} ${offer.currency || 'PLN'}`}
          dateFrom={offer.date_from || ''}
          dateTo={offer.date_to || ''}
          country={offer.country}
          port={offer.port}
          seatsAvailable={offer.seats_available}
          seatsTotal={offer.seats_total}
        />

        <OfferDescription description={offer.description} />

        <OfferGallery offerId={offer.id} />

        <OfferOrganizer
          organizerId={offer.organizer_id}
          organizerName={organizer?.name}
          isLoading={organizerLoading}
        />

        {showParticipants && (
          <OfferParticipants
            participants={participants}
            isLoading={participantsLoading}
          />
        )}

        {!isOrganizer && (
          <OfferActions
            onReservation={handleReservation}
            onContact={handleContact}
            canReserve={canReserve}
          />
        )}

        {questionSent && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Pytanie zostało wysłane.
          </div>
        )}

        <CreateTripAlertButton offer={offer} />

        {isOrganizer && <BookingsPanel offerId={offer.id} />}

        {showModal && (
          <BookingModal
            offerId={offer.id}
            canReserve={canReserve}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}

        {showQuestionModal && (
          <QuestionModal
            offerId={offer.id}
            onClose={() => setShowQuestionModal(false)}
            onSuccess={handleQuestionSuccess}
          />
        )}

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