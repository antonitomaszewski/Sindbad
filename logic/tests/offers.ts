import { getOffers, createOffer, getOfferById, updateOffer, deleteOffer } from '../lib/offers';
import { loginUser } from '../lib/users';
import pb from '../lib/pocketbase';

console.log("===> Offers test file started!");

async function testOffers() {
  // Dane testowe (podmień na istniejącego usera!)
  const organizer_id = 'wqsqocbye1r7gzo';

// Dane testowego użytkownika:
  const email = 'testfs0olu65yvi@example.com';
  const password = 'Test1234!';

  // Logowanie użytkownika (przed operacjami na ofertach!)
  await loginUser(email, password);
  console.log('Zalogowano użytkownika:', pb.authStore.model);

  // 1. CREATE
  console.log('--- Create offer');
  const offer = await createOffer({
    title: 'Testowa oferta',
    organizer_id,
    description: 'Opis testowej oferty',
    date_from: '2025-07-10T10:00:00Z',
    date_to: '2025-07-15T17:00:00Z',
    location: 'Warszawa',
    geo: {lat: 52.2297, lon: 21.0122}
  });
  console.log('Utworzona oferta:', offer);

  // 2. GET ALL
  console.log('--- Get all offers');
  const offers = await getOffers();
  console.log('Wszystkie oferty:', offers);

  // 3. GET BY ID
  console.log('--- Get offer by ID');
  const got = await getOfferById(offer.id);
  console.log('Pobrana oferta:', got);

  // 4. UPDATE
  console.log('--- Update offer');
  const updated = await updateOffer(offer.id, { title: 'Oferta po edycji' });
  console.log('Zaktualizowana oferta:', updated);

  // 5. DELETE
  console.log('--- Delete offer');
  const deleted = await deleteOffer(offer.id);
  console.log('Oferta usunięta:', deleted);

  // 6. CREATE with non-existent organizer_id
  console.log('--- Create offer with non-existent organizer_id');
  try {
    const badOffer = await createOffer({
      title: 'Oferta z błędnym organizatorem',
      organizer_id: 'not_a_real_user_id',
      description: 'To nie powinno się udać'
    });
    console.log('Unexpected success! Oferta została utworzona:', badOffer);
  } catch (err) {
    if (err instanceof Error) {
      console.log('Oczekiwany błąd (nieistniejący organizer_id):', err.message);
    } else {
      console.log('Oczekiwany błąd (nieistniejący organizer_id):', err);
    }
  }
}

testOffers().catch(console.error);