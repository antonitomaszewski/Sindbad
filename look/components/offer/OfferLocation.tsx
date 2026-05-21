interface Props {
  country: string;
  port: string;
  countries: { code: string; name: string; namePL: string }[];
  onCountryChange: (value: string) => void;
  onPortChange: (value: string) => void;
  errors?: { country?: string; port?: string };
}

export default function OfferLocation({ country, port, countries, onCountryChange, onPortChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
          Kraj <span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors?.country ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Wybierz kraj</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.namePL}
            </option>
          ))}
        </select>
        {errors?.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-2">
          Port <span className="text-red-500">*</span>
        </label>
        <input
          id="port"
          type="text"
          value={port}
          onChange={(e) => onPortChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors?.port ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="np. Gdańsk, Wilkasy, Split"
        />
        {errors?.port && <p className="mt-1 text-sm text-red-600">{errors.port}</p>}
      </div>
    </div>
  );
}