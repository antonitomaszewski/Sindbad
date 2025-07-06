import { EventModalProps } from '@/look/types/calendar';
import { CALENDAR_TEXTS } from '@/look/constants/calendar';

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray p-6 max-w-sm">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-main">{event.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray hover:text-black text-xl">
            {CALENDAR_TEXTS.CLOSE_BUTTON}
          </button>
        </div>
        <div className="space-y-2 text-sm text-gray">
          <p><strong>{CALENDAR_TEXTS.DATE_LABEL}</strong>{event.start?.toLocaleDateString()} - {event.end?.toLocaleDateString()}</p>
          <p><strong>{CALENDAR_TEXTS.DESCRIPTION_LABEL}</strong>{CALENDAR_TEXTS.DESCRIPTION_PLACEHOLDER}</p>
        </div>
        <button 
          onClick={() => window.location.href = `/oferta/${event.id}`}
          className="w-full mt-4 px-4 py-2 bg-main text-white rounded hover:text-green-dark">
          {CALENDAR_TEXTS.DETAILS_BUTTON}
        </button>
      </div>
    </div>
  );
}