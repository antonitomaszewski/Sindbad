"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState, useEffect } from 'react';
import EventModal from '@/look/components/ui/EventModal';
import { getOffers } from '@/logic/lib/offers';

export default function KalendarzPage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offers = await getOffers();
        const calendarEvents = offers.map((offer: any) => ({
          id: offer.id,
          title: offer.title,
          date: offer.date_from,
          allDay: true,
          backgroundColor: 'var(--green-main)',
          borderColor: 'var(--green-main)',
        }));
        setEvents(calendarEvents);
        setLoading(false);
      } catch (error) {
        console.error('Błąd pobierania ofert:', error);
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-main mb-6">Kalendarz wydarzeń</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray p-6">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
          }}
          eventClick={handleEventClick}
        />
      </div>

      <EventModal 
        event={selectedEvent}
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  );
}