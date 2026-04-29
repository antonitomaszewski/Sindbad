'use client';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchResults from './SearchResults';
import { searchOffers } from '../../../logic/lib/offers';
import { getAllCountries } from '../../../logic/lib/countries';
import { getAllOrganizers } from '../../../logic/lib/users';
import { dateToString } from '../../../logic/lib/dates';
import { filterOffers } from '../../../logic/lib/filtering';
import { loadOfferImages, loadOrganizerNames } from '../../../logic/lib/offerData';
import { Offer } from '../../../logic/types/offer';

interface Filters {
  country: string;
  port: string;
  priceMin: string;
  priceMax: string;
  onlyFree: boolean;
  organizerId: string;
}

export default function SearchPanel() {
  const [q, setQ] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [onlyFuture, setOnlyFuture] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    country: '',
    port: '',
    priceMin: '',
    priceMax: '',
    onlyFree: false,
    organizerId: '',
  });

  const [allResults, setAllResults] = useState<Offer[]>([]);
  const [filteredResults, setFilteredResults] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ code: string; name: string; namePL: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [offerImages, setOfferImages] = useState<Map<string, string>>(new Map());
  const [organizers, setOrganizers] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    let mounted = true;
    Promise.all([getAllCountries(), getAllOrganizers()]).then(([cs, us]) => {
      if (mounted) {
        setCountries(cs);
        setUsers(us);
      }
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(), 350);
    return () => clearTimeout(timer);
  }, [q, dateFrom, dateTo, onlyFuture]);

  useEffect(() => {
    setFilteredResults(filterOffers(allResults, filters, countries));
  }, [allResults, filters, countries]);

  async function fetchResults() {
    setLoading(true);

    const data = await searchOffers({
      q: q || undefined,
      dateFrom: dateToString(dateFrom),
      dateTo: dateToString(dateTo),
      onlyFuture,
    });

    setAllResults(data ?? []);

    const [imageMap, organizerMap] = await Promise.all([
      loadOfferImages(data ?? []),
      loadOrganizerNames(data ?? []),
    ]);

    setOfferImages(imageMap);
    setOrganizers(organizerMap);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Szukaj rejsów — wyszukuje w title i description */}
      <div className="flex justify-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Szukaj rejsów po nazwie lub opisie..."
          className="w-full md:w-2/3 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filtry - lewa kolumna */}
        <div className="col-span-1">
          <div className="bg-white p-4 rounded shadow space-y-3 sticky top-4">
            <h4 className="font-semibold">Filtry</h4>

            <div>
              <label className="block mb-1 text-sm font-medium">Kraj</label>
              <select 
                value={filters.country} 
                onChange={(e) => setFilters({ ...filters, country: e.target.value })} 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wszystkie</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>{c.namePL}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Port</label>
              <input
                value={filters.port}
                onChange={(e) => setFilters({ ...filters, port: e.target.value })}
                placeholder="np. Gdańsk"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Organizator</label>
              <select 
                value={filters.organizerId} 
                onChange={(e) => setFilters({ ...filters, organizerId: e.target.value })} 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wszyscy</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Data wyjazdu (od)</label>
              <DatePicker
                selected={dateFrom}
                onChange={(date : any) => setDateFrom(date)}
                dateFormat="dd.MM.yyyy"
                placeholderText="Wybierz datę"
                isClearable
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Data wyjazdu (do)</label>
              <DatePicker
                selected={dateTo}
                onChange={(date: any) => setDateTo(date)}
                dateFormat="dd.MM.yyyy"
                placeholderText="Wybierz datę"
                isClearable
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Cena (zł)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="min"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                  className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="max"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                  className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.onlyFree} 
                onChange={(e) => setFilters({ ...filters, onlyFree: e.target.checked })} 
              />
              Tylko z wolnymi miejscami
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={onlyFuture} 
                onChange={(e) => setOnlyFuture(e.target.checked)} 
              />
              Pomiń rejsy z przeszłości
            </label>
          </div>
        </div>

        {/* Wyniki - prawa kolumna (3 szerokości) */}
        <div className="col-span-1 md:col-span-3">
          <SearchResults 
            results={filteredResults} 
            loading={loading} 
            offerImages={offerImages} 
            organizers={organizers} 
          />
        </div>
      </div>
    </div>
  );
}