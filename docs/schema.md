-- users (Pocketbase)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  created timestamp DEFAULT now(),
  updated timestamp DEFAULT now()
);

-- offers
CREATE TABLE offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date_from date,
  date_to date,
  location text,
  organizer_id uuid REFERENCES users(id),
  contact text,
  created timestamp DEFAULT now(),
  updated timestamp DEFAULT now()
);


| Metoda PocketBase SDK                      | Dotyczy API Rule  | Opis działania metody                                      |
|--------------------------------------------|-------------------|------------------------------------------------------------|
| pb.collection('nazwa').getList(...)        | List              | Pobieranie listy rekordów (z paginacją)                    |
| pb.collection('nazwa').getFullList(...)    | List              | Pobieranie wszystkich rekordów (bez paginacji)             |
| pb.collection('nazwa').getOne(id)          | View              | Pobieranie 1 rekordu po id                                 |
| pb.collection('nazwa').create(data)        | Create            | Tworzenie nowego rekordu                                   |
| pb.collection('nazwa').update(id, data)    | Update            | Aktualizacja rekordu po id                                 |
| pb.collection('nazwa').delete(id)          | Delete            | Usuwanie rekordu po id                                     |
| pb.collection('nazwa').authWithPassword()  | ---               | Rejestracja/logowanie użytkownika (nie dotyczy rules)      |
| pb.collection('nazwa').requestVerification() | ---             | Żądanie weryfikacji e-mail (nie dotyczy rules)             |