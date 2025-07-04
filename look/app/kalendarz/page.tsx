"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState } from 'react';
import EventModal from '@/look/components/ui/EventModal';

export default function KalendarzPage() {
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const events = [
    {
      id: '1',
      title: 'Wycieczka górska',
      date: '2025-07-15',
      backgroundColor: 'var(--green-main)',
      borderColor: 'var(--green-main)',
    },
    {
      id: '2', 
      title: 'Kurs wspinaczki',
      date: '2025-07-20',
      backgroundColor: 'var(--green-main)',
      borderColor: 'var(--green-main)',
    },
    {
      id: '3',
      title: 'Spływ kajakowy',
      date: '2025-07-25',
      backgroundColor: 'var(--green-main)',
      borderColor: 'var(--green-main)',
    }
  ];

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