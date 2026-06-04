import { CURRENCIES } from '../../../logic/types/offer';

interface Props {
  price: string;
  currency: 'PLN' | 'EUR' | 'USD';
  onPriceChange: (value: string) => void;
  onCurrencyChange: (value: 'PLN' | 'EUR' | 'USD') => void;
  errors?: { price_per_person?: string };
}

export default function OfferPricing({ price, currency, onPriceChange, onCurrencyChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cena za osobę <span className="text-gray-400"></span>
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            min="0"
            step="0.01"
            className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors?.price_per_person ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
        {errors?.price_per_person && <p className="mt-1 text-sm text-red-600">{errors.price_per_person}</p>}
      </div>
    </div>
  );
}