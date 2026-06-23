// do wyświetlania kalendarza korzystam z full calendar z reacta
// po klikaniu na wydarzenie otwiera się modal
// plLocale - ważne żeby mieć jeden czas dat w projekcie, by się nie rozjeżdzały (utc vs pl)
"use client";

import dynamic from 'next/dynamic';
import dayGridPlugin from '@fullcalendar/daygrid';
import plLocale from '@fullcalendar/core/locales/pl';
import EventModal from '@/look/components/ui/EventModal';
import { useOffers } from '@/look/hooks/useOffers';
import { useEventModal } from '@/look/hooks/useEventModal';
import { CALENDAR_TEXTS, CALENDAR_CONFIG } from '@/look/constants/calendar';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

export default function KalendarzPage() {
  const { events, loading } = useOffers();
  const { selectedEvent, showModal, openModal, closeModal } = useEventModal();

  const handleEventClick = (info: any) => {
    openModal(info.event);
  };
  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-main mb-6 text-center">{CALENDAR_TEXTS.PAGE_TITLE}</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray">{CALENDAR_TEXTS.LOADING_MESSAGE}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-main mb-6 text-center">{CALENDAR_TEXTS.PAGE_TITLE}</h1>
      <div className="bg-white rounded-2xl border border-gray p-8">
        <FullCalendar
          plugins={[dayGridPlugin]}
          locale={plLocale}
          initialView={CALENDAR_CONFIG.INITIAL_VIEW}
          height={CALENDAR_CONFIG.HEIGHT}
          events={events}
          headerToolbar={CALENDAR_CONFIG.HEADER_TOOLBAR}
          eventBackgroundColor={CALENDAR_CONFIG.EVENT_COLORS.BACKGROUND}
          eventBorderColor={CALENDAR_CONFIG.EVENT_COLORS.BORDER}
          defaultAllDay={CALENDAR_CONFIG.EVENT_DEFAULTS.allDay}
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