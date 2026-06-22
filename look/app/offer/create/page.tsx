// Strona tworzenia oferty.

import CreateOfferForm from '../../../components/offer/CreateOfferForm';
import { getAllCountries } from '../../../../logic/lib/countries';

export default async function CreateOfferPage() {
  const countries = await getAllCountries();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Dodaj nową ofertę</h1>
          <p className="text-gray-600">Wypełnij formularz, aby opublikować swój rejs</p>
        </div>

        <CreateOfferForm countries={countries} />
      </div>
    </div>
  );
}