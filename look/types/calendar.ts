export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  description?: string;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
};

export type EventModalProps = {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}