// kalendarz do wybierania czasu trwania rejsu podczas tworzenia oferty

import { DateRangePicker } from '@/look/components/ui/DateRangePicker';

interface Props {
  dateFrom: Date | null;
  dateTo: Date | null;
  onDateFromChange: (date: Date | null) => void;
  onDateToChange: (date: Date | null) => void;
  errors?: { date_from?: string; date_to?: string };
}

export default function OfferDatePicker({ dateFrom, dateTo, onDateFromChange, onDateToChange, errors }: Props) {
  return (
    <DateRangePicker
      startLabel="Data rozpoczęcia"
      endLabel="Data zakończenia"
      startDate={dateFrom}
      endDate={dateTo}
      onStartDateChange={onDateFromChange}
      onEndDateChange={onDateToChange}
      startError={errors?.date_from}
      endError={errors?.date_to}
      minStartDate={new Date()}
      minEndDate={dateFrom || new Date()}
    />
  );
}