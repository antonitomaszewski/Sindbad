import { describe, it, expect } from "vitest";
import { createOffer, getOffers, getOfferById, updateOffer, deleteOffer } from "../lib/offers";
import { loginUser, registerUser } from "../lib/users";
import { ERRORS } from "../lib/messages";

// Pomocnicze dane testowe
const testLocation = {
  lat: 52.2297,
  lon: 21.0122,
  location: "Warszawa"
};

describe("offers logic", () => {
  it("creates, gets, updates, deletes offer and checks relation integrity", async () => {
    // Najpierw tworzymy i logujemy użytkownika
    const email = `offeruser${Math.random().toString(36).slice(2)}@example.com`;
    const password = "OfferTest123!";
    const name = "Test Offer User";

    // Rejestracja i logowanie
    const user = await registerUser(email, password, password, name);
    await loginUser(email, password);

    // CREATE
    const offerData = {
      title: "Testowa oferta",
      organizer_id: user.id,
      description: "Opis testowej oferty",
      date_from: "2025-07-10T10:00:00Z",
      date_to: "2025-07-15T17:00:00Z",
      location: testLocation.location,
      geo: { lat: testLocation.lat, lon: testLocation.lon }
    };
    const offer = await createOffer(offerData);
    expect(offer).toBeDefined();
    expect(offer.title).toBe(offerData.title);
    expect(offer.organizer_id).toBe(user.id);

    // GET ALL
    const offers = await getOffers();
    expect(Array.isArray(offers)).toBe(true);
    expect(offers.find(o => o.id === offer.id)).toBeDefined();

    // GET BY ID
    const gotById = await getOfferById(offer.id);
    expect(gotById).toBeDefined();
    expect(gotById?.id).toBe(offer.id);

    // UPDATE
    const updatedTitle = "Zmieniona oferta";
    const updated = await updateOffer(offer.id, { title: updatedTitle });
    expect(updated).toBeDefined();
    expect(updated?.title).toBe(updatedTitle);

    // DELETE
    const deleted = await deleteOffer(offer.id);
    expect(deleted).toBe(true);

    // Po usunięciu nie powinno się dać pobrać oferty
    const gotAfterDelete = await getOfferById(offer.id);
    expect(gotAfterDelete).toBeNull();

    // NEGATYWNY: próba utworzenia oferty z nieistniejącym organizer_id
    await expect(
      createOffer({
        ...offerData,
        organizer_id: "fake_id_123456"
      })
    ).rejects.toThrow(ERRORS.CREATE_FAILED || "Failed to create record."); // dopasuj do swojego error handlingu
  });
});