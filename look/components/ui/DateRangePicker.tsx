'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  startLabel: string;
  endLabel: string;
  startError?: string;
  endError?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  minStartDate?: Date;
  minEndDate?: Date;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel,
  endLabel,
  startError,
  endError,
  startPlaceholder = 'Wybierz datę',
  endPlaceholder = 'Wybierz datę',
  minStartDate,
  minEndDate,
}: DateRangePickerProps) {
  const baseInputClassName = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {startLabel}
        </label>
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          dateFormat="dd.MM.yyyy"
          minDate={minStartDate}
          placeholderText={startPlaceholder}
          isClearable
          className={`${baseInputClassName} ${startError ? 'border-red-300' : 'border-gray-300'}`}
        />
        {startError && <p className="mt-1 text-sm text-red-600">{startError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {endLabel}
        </label>
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          dateFormat="dd.MM.yyyy"
          minDate={minEndDate}
          placeholderText={endPlaceholder}
          isClearable
          className={`${baseInputClassName} ${endError ? 'border-red-300' : 'border-gray-300'}`}
        />
        {endError && <p className="mt-1 text-sm text-red-600">{endError}</p>}
      </div>
    </div>
  );
}