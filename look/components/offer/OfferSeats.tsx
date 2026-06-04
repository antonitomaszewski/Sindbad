interface Props {
  seatsTotal: string;
  seatsAvailable: string;
  onSeatsTotalChange: (value: string) => void;
  onSeatsAvailableChange: (value: string) => void;
  errors?: { seats_total?: string; seats_available?: string };
}

export default function OfferSeats({ seatsTotal, seatsAvailable, onSeatsTotalChange, onSeatsAvailableChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="seatsTotal" className="block text-sm font-medium text-gray-700 mb-2">
          Liczba miejsc (całkowita) <span className="text-gray-400"></span>
        </label>
        <input
          id="seatsTotal"
          type="number"
          value={seatsTotal}
          onChange={(e) => onSeatsTotalChange(e.target.value)}
          min="0"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus-ring-main transition ${
            errors?.seats_total ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="np. 8"
        />
        {errors?.seats_total && <p className="mt-1 text-sm text-red-600">{errors.seats_total}</p>}
      </div>

      <div>
        <label htmlFor="seatsAvailable" className="block text-sm font-medium text-gray-700 mb-2">
          Liczba wolnych miejsc <span className="text-gray-400"></span>
        </label>
        <input
          id="seatsAvailable"
          type="number"
          value={seatsAvailable}
          onChange={(e) => onSeatsAvailableChange(e.target.value)}
          min="0"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus-ring-main transition ${
            errors?.seats_available ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="np. 3"
        />
        {errors?.seats_available && <p className="mt-1 text-sm text-red-600">{errors.seats_available}</p>}
        <p className="mt-1 text-xs text-gray-500">Jeśli już masz zapisanych uczestników poza systemem</p>
      </div>
    </div>
  );
}