"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import EventModal from '@/look/components/ui/EventModal';
import { useOffers } from '@/look/hooks/useOffers';
import { useEventModal } from '@/look/hooks/useEventModal';
import { CALENDAR_TEXTS, CALENDAR_CONFIG } from '@/look/constants/calendar';

export default function KalendarzPage() {
  const { events, loading } = useOffers();
  const { selectedEvent, showModal, openModal, closeModal } = useEventModal();

  const handleEventClick = (info: any) => {
    openModal(info.event);
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-main mb-6">{CALENDAR_TEXTS.PAGE_TITLE}</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray">{CALENDAR_TEXTS.LOADING_MESSAGE}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-main mb-6">{CALENDAR_TEXTS.PAGE_TITLE}</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray p-6">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView={CALENDAR_CONFIG.INITIAL_VIEW}
          height={CALENDAR_CONFIG.HEIGHT}
          events={events}
          headerToolbar={CALENDAR_CONFIG.HEADER_TOOLBAR}
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