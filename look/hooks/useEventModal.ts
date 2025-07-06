// look/hooks/useEventModal.ts
import { useState } from 'react';

export function useEventModal() {
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