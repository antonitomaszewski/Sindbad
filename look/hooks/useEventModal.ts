
import { useState } from 'react';

export function useEventModal() {
  // selectedEvent, showModal - zarządza stanami
  // setSelectedEvent, setShowModal - settery
  // jak otwieram - pokazuję dane wydarzenie rejsu
  // zamykam - chowam
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return {
    selectedEvent,
    showModal,
    openModal,
    closeModal
  };
}