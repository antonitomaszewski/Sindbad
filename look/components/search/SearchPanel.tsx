// strona wyszukiwania
// mamy tutaj  pobranie organizaotorów do dobrego filtrowania oraz dobrego podczepienia ich do ofert
// przefiltrowanie ofert
// 
'use client';
import { useState, useEffect } from 'react';
import SearchResults from './SearchResults';
import { searchOffers } from '../../../logic/lib/offers';
import { getAllCountries } from '../../../logic/lib/countries';
import { getAllOrganizers } from '../../../logic/lib/users';
import { dateToString } from '@/look/utils/dateFormatter';
import { loadOfferImages } from '../../../logic/lib/offers';
import { Offer } from '../../../logic/types/offer';
import { DateRangePicker } from '@/look/components/ui/DateRangePicker';
// import { Button } from '../ui/Button';
import {OfferFilters} from '@/logic/types/offer';

// type sortByType =  'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';

export default function SearchPanel() {
  const [filters, setFilters] = useState<OfferFilters>({
    country: '',
    port: '',
    priceMin: '',
    priceMax: '',
    onlyFree: true,
    organizerId: '',
    dateFrom: null,
    dateTo: null,
    onlyFuture: true,
  });

  const [allResults, setAllResults] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ code: string; name: string; namePL: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string}[]>([]);
  const [offerImages, setOfferImages] = useState<Map<string, string>>(new Map());
  const [organizers, setOrganizers] = useState<Map<string, string>>(new Map());
  // const [sortBy, setSortBy] = useState<sortByType>("date_asc");

  useEffect(() => {
    let mounted = true;
    Promise.all([getAllCountries(), getAllOrganizers()]).then(([cs, us]) => {
      if (mounted) {
        setCountries(cs);
        setUsers(us);
        setOrganizers(new Map(us.map((u) => [u.id, u.name])))
      }
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(), 350);
    return () => clearTimeout(timer);
  }, [filters]);

  // useEffect(() => {
  //   allResults.sort((a,b) => {
  //     if (sortBy === 'date_asc')  return (a.date_from || '').localeCompare(b.date_from || '');
  //     if (sortBy === 'date_desc') return (b.date_from || '').localeCompare(a.date_from || '');
  //     if (sortBy === 'price_desc')  return (a.price_per_person || 0) - (b.price_per_person || 0);
  //     if (sortBy === 'price_asc') return (b.price_per_person || 0) - (a.price_per_person || 0);
  //     return 0;
  //   });
  // }, [allResults, filters, sortBy]);

  // const handleClear = () => {
  //   setFilters({
  //     country: '',
  //     port: '',
  //     priceMin: '',
  //     priceMax: '',
  //     onlyFree: true,
  //     organizerId: '',
  //     dateFrom: null,
  //     dateTo: null,
  //     onlyFuture: true,
  //   });
  // }

  async function fetchResults() {
    setLoading(true);

    const data = await searchOffers({
      country: filters.country,
      port: filters.port,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      onlyFree: filters.onlyFree,
      organizerId: filters.organizerId,
      dateFrom: dateToString(filters.dateFrom),
      dateTo: dateToString(filters.dateTo),
      onlyFuture: filters.onlyFuture,
    });

    setAllResults(data ?? []);
    const imageMap = await loadOfferImages(data ?? [])

    setOfferImages(imageMap);
    setLoading(false);
  }

  return (
    <div>
      {/* całośc 4 kolumnowa zazwyczaj */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* część filtrów, na 1 kolumnę szeroka */}
        <div className="col-span-1">
          {/* sticky - na początku jak przewijamy do filtry zostają widoczne
          padding-4 od każdego boku odsunięte (passepartout) */}
          <div className="bg-white p-4 rounded shadow space-y-3 sticky top-4">
            <h3 className="font-semibold">Filtry</h3>

            {/* {(filters.dateFrom || filters.dateTo || !filters.onlyFuture ||
  filters.country || filters.port || filters.priceMin ||
  filters.priceMax || !filters.onlyFree || filters.organizerId) &&
            (<Button onClick={handleClear} variant="secondary">
              Wyczyść filtry
            </Button>)} */}

            {/* <div>
              <label className="block mb-1 text-sm font-medium">Sortowanie</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as sortByType)} 
                className="w-full p-2 border rounded focus-ring-main focus-border-main"
              >
                <option value="date_asc">Data od najwcześniejszej</option>
                <option value="date_desc">Data od najpóźnieszej</option>
                <option value="price_asc">Cena od najniższej</option>
                <option value="price_desc">Cena od najwyższej</option>
              </select>
            </div> */}

            <div>
              <label className="block mb-1 text-sm font-medium">Kraj</label>
              <select 
                value={filters.country} 
                onChange={(e) => setFilters({ ...filters, country: e.target.value })} 
                className="w-full p-2 border rounded focus-ring-main focus-border-main"
              >
                <option value="">Wszystkie</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.namePL}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Port</label>
              <input
                value={filters.port}
                onChange={(e) => setFilters({ ...filters, port: e.target.value })}
                placeholder="np. Gdańsk"
                className="w-full p-2 border rounded focus-ring-main focus-border-main"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Organizator</label>
              <select 
                value={filters.organizerId} 
                onChange={(e) => setFilters({ ...filters, organizerId: e.target.value })} 
                className="w-full p-2 border rounded focus-ring-main focus-border-main"
              >
                <option value="">Wszyscy</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <DateRangePicker
              startLabel="Data wyjazdu (od)"
              endLabel="Data wyjazdu (do)"
              startDate={filters.dateFrom}
              endDate={filters.dateTo}
              onStartDateChange={(date) => setFilters((current) => ({ ...current, dateFrom: date }))}
              onEndDateChange={(date) => setFilters((current) => ({ ...current, dateTo: date }))}
              minEndDate={filters.dateFrom ?? undefined}
            />

            <div>
              <label className="block mb-1 text-sm font-medium">Cena (zł)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="min"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                  className="w-1/2 p-2 border rounded focus-ring-main focus-border-main"
                />
                <input
                  type="number"
                  placeholder="max"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                  className="w-1/2 p-2 border rounded focus-ring-main focus-border-main"
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
                checked={filters.onlyFuture} 
                onChange={(e) => setFilters({ ...filters, onlyFuture: e.target.checked })} 
              />
              Pomiń rejsy z przeszłości
            </label>
          </div>
        </div>

        <div className="col-span-1 md:col-span-3">
          <SearchResults 
            results={allResults} 
            loading={loading} 
            offerImages={offerImages} 
            organizers={organizers} 
          />
        </div>
      </div>
    </div>
  );
}