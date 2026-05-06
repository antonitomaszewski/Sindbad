import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  dateFrom: Date | null;
  dateTo: Date | null;
  onDateFromChange: (date: Date | null) => void;
  onDateToChange: (date: Date | null) => void;
  errors?: { date_from?: string; date_to?: string };
}

export default function OfferDatePicker({ dateFrom, dateTo, onDateFromChange, onDateToChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data rozpoczęcia <span className="text-red-500">*</span>
        </label>
        <DatePicker
          selected={dateFrom}
          onChange={onDateFromChange}
          dateFormat="dd.MM.yyyy"
          minDate={new Date()}
          placeholderText="Wybierz datę"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors?.date_from ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors?.date_from && <p className="mt-1 text-sm text-red-600">{errors.date_from}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data zakończenia <span className="text-red-500">*</span>
        </label>
        <DatePicker
          selected={dateTo}
          onChange={onDateToChange}
          dateFormat="dd.MM.yyyy"
          minDate={dateFrom || new Date()}
          placeholderText="Wybierz datę"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors?.date_to ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors?.date_to && <p className="mt-1 text-sm text-red-600">{errors.date_to}</p>}
      </div>
    </div>
  );
}