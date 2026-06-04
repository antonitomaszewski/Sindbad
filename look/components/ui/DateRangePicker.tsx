'use client';

import DatePicker from 'react-datepicker';
import { pl } from 'date-fns/locale/pl';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pl', pl);

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
  fieldClassName?: string;
  inputClassName?: string;
  popperClassName?: string;
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
  fieldClassName,
  inputClassName,
  popperClassName,
}: DateRangePickerProps) {
  const baseInputClassName = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus-ring-main transition';
  const baseLabelClassName = 'mb-1 block text-xs text-gray-600';
  const combinedInputClassName = `${baseInputClassName} ${inputClassName || ''}`.trim();

  return (
    <div className="space-y-3">
      <div className={fieldClassName}>
        <label className={baseLabelClassName}>
          {startLabel}
        </label>
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          locale="pl"
          dateFormat="dd.MM.yyyy"
          minDate={minStartDate}
          placeholderText={startPlaceholder}
          isClearable
          className={`${combinedInputClassName} ${startError ? 'border-red-300' : 'border-gray-300'}`}
          popperClassName={popperClassName}
        />
        {startError && <p className="mt-1 text-sm text-red-600">{startError}</p>}
      </div>

      <div className={fieldClassName}>
        <label className={baseLabelClassName}>
          {endLabel}
        </label>
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          locale="pl"
          dateFormat="dd.MM.yyyy"
          minDate={minEndDate}
          placeholderText={endPlaceholder}
          isClearable
          className={`${combinedInputClassName} ${endError ? 'border-red-300' : 'border-gray-300'}`}
          popperClassName={popperClassName}
        />
        {endError && <p className="mt-1 text-sm text-red-600">{endError}</p>}
      </div>
    </div>
  );
}