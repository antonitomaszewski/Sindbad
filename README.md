# Struktura projektu Sindbad

Sindbad to aplikacja do wyszukiwania rejsów, tworzenia ofert, rezerwacji miejsc oraz budowania zaufania między użytkownikami przez profile, opinie, historię rejsów i wspólne kontakty.

Pliki, foldery i najważniejsze funkcje są opisane komentarzami w kodzie lub w lokalnych plikach doc.md. Opisy dodawałem tam, gdzie ułatwiają zrozumienie struktury projektu; sporadycznie ich nie ma, jeśli plik albo funkcja są oczywiste z nazwy i kontekstu.

## Główna struktura

```text
Sindbad/
  app/                 ścieżki Next.js widoczne dla użytkownika
  look/                warstwa widoku: strony, komponenty, hooki, utils, stałe
  logic/               logika aplikacji: baza, modele, stałe, walidacja, maile, testy
  docs/                materiały do pracy, prezentacji i notatki
  README.md            krótki opis projektu
```

## app

Folder `app` zawiera tylko routing Next.js. Pliki w tym folderze importują gotowe widoki z `look/app`.

```text
app/
  page.tsx                 strona główna
  not-found.tsx            globalna strona 404
  logowanie/page.tsx       logowanie
  rejestracja/page.tsx     rejestracja
  szukaj/page.tsx          wyszukiwanie ofert
  mapa/page.tsx            mapa ofert
  kalendarz/page.tsx       kalendarz ofert
  oferta/[id]/page.tsx     szczegóły oferty
  oferta/nowa/page.tsx     tworzenie oferty
  profil/[id]/page.tsx     profil użytkownika
  profil/[id]/edytuj/page.tsx edycja profilu
```

## look

Folder `look` zawiera frontend aplikacji.

```text
look/
  app/          właściwe widoki stron
  components/   komponenty interfejsu
  hooks/        hooki pobierające dane i obsługujące widoki
  utils/        funkcje pomocnicze do prezentacji danych
  constants/    stałe używane w widokach
  types/        typy pomocnicze warstwy widoku
```

## look/app

```text
look/app/page.tsx                      strona główna z opisem i statystykami
look/app/not-found.tsx                 globalna strona 404
look/app/search/page.tsx               strona wyszukiwania ofert
look/app/mapa/page.tsx                 strona mapy rejsów
look/app/kalendarz/page.tsx            strona kalendarza rejsów
look/app/oferta/[id]/page.tsx          strona szczegółów oferty
look/app/offer/create/page.tsx         strona tworzenia oferty
look/app/profil/[id]/page.tsx          profil użytkownika
look/app/profil/[id]/edytuj/page.tsx   edycja profilu
look/app/auth/login/page.tsx           logowanie
look/app/auth/register/page.tsx        rejestracja
```

## look/components

```text
auth          logowanie OAuth
booking       rezerwacje, formularz rezerwacji, panel zarządzania rezerwacjami
comments      opinie ofert i formularz dodawania/edycji komentarza
common        wspólne widoki, np. loading i not found
layout        układ strony: navbar, footer, layout
offer         tworzenie, edycja i wyświetlanie ofert rejsów
profile       profil użytkownika, historia rejsów, certyfikaty, edycja profilu
search        panel wyszukiwania, wyniki i kafelki ofert
trip-alerts   tworzenie, edycja i lista powiadomień o rejsach
ui            ogólne elementy interfejsu: input, button, card, logo, modal
```

## Najważniejsze komponenty

`BookingModal` obsługuje formularz rezerwacji oferty. Działa dla użytkownika zalogowanego i niezalogowanego. Wiadomość ma limit 200 znaków.

`BookingsPanel` jest panelem organizatora do zmiany statusów rezerwacji. Po zmianie statusu wysyłany jest mail. Organizator może zaakceptować albo odrzucić rezerwację.

`MyBookingsList` pokazuje rezerwacje użytkownika na jego profilu i pozwala filtrować je po statusie.

`OfferHeader` pokazuje najważniejsze dane oferty: kraj, termin, cenę i podstawowe informacje.

`OfferGallery` pokazuje galerię zdjęć oferty przez lightbox. Siatka jest responsywna.

`OfferLocation` pozwala wybrać pozycję rejsu na mapie podczas tworzenia oferty. Te dane są potem używane na mapie ofert.

`OfferParticipants` pokazuje uczestników rejsu, jeśli użytkownik ma do tego dostęp.

`OfferCommentsSection` pokazuje opinie na stronie oferty.

`CommentModal` służy do dodawania i edycji komentarza.

`OrganizerReviewsSummary` pokazuje opinie o organizatorze na profilu i pozwala filtrować je po ocenie.

`SailedWithSection` pokazuje osoby, z którymi użytkownik żeglował. Kontakty są rozwijalne i pokazują wspólne rejsy.

`TripHistory` pokazuje historię rejsów organizowanych przez użytkownika.

## look/hooks

```text
useUser          pobiera pojedynczego użytkownika, używany m.in. na profilu, ofercie i w alertach
useOffer         pobiera pojedynczą ofertę
useOffers        pobiera oferty do kalendarza i mapuje je pod FullCalendar
useOfferImages   pobiera zdjęcia oferty
useEventModal    obsługuje modal wydarzenia w kalendarzu
useMapOffers     pobiera oferty dla mapy
useLeafletMap    obsługuje Leaflet i klastry pinezek
```

## look/utils

```text
dateFormatter   funkcje do formatowania dat i zakresów dat
eventMapper     mapowanie ofert na format wydarzeń FullCalendar
mapOffers       przygotowanie geo i filtrowanie ofert na mapie
mapPopup        HTML popupu po kliknięciu pinezki na mapie
```

## look/constants

```text
booking      stałe dla rezerwacji
calendar     stałe widoku kalendarza
navigation   lista linków używana w navbarze i stopce
offer        komunikaty i stałe strony oferty
texts        teksty stopki i logo
```


## Główne reguły biznesowe

Użytkownik niezalogowany może przeglądać oferty i wysłać pytanie do organizatora, ale do rezerwacji potrzebuje konta.

Użytkownik zalogowany może rezerwować rejsy, tworzyć oferty, edytować profil, zarządzać powiadomieniami i przeglądać profile zgodnie z ustawieniami prywatności.

Organizator może zarządzać rezerwacjami swojej oferty. Zmiana statusu rezerwacji wysyła wiadomość email.

Członek załogi po zakończonym rejsie może dodać komentarz.

Profil prywatny jest dostępny dla właściciela profilu oraz osób, które były z nim na wspólnym rejsie. Profil publiczny jest dostępny dla wszystkich.

Powiadomienia o rejsach można tworzyć z profilu albo ze strony oferty. Alert dopasowuje kraj, organizatora i zakres dat.

## logic

Folder `logic` zawiera logikę aplikacji niezależną od widoku.

```text
logic/
  constants/   stałe logiczne, np. kraje i obrazy
  hooks/       hook walidacji formularzy
  lib/         funkcje operujące na bazie i modelach
  types/       typy odpowiadające modelom i danym aplikacji
  tests/       testy logiki
```

## logic/lib

```text
pocketbase      inicjalizacja klienta PocketBase
users           autoryzacja, użytkownicy, profile, edycja danych
offers          pobieranie, tworzenie i filtrowanie ofert
bookings        rezerwacje, kontakty między użytkownikami, uczestnicy rejsu
comments        komentarze po zakończonym rejsie i opinie o organizatorach
tripAlerts      powiadomienia o rejsach pasujących do filtrów użytkownika
emails          wysyłanie wiadomości email
emailTemplates  szablony maili
images          upload i pobieranie obrazków użytkownika oraz oferty
certifications  certyfikaty użytkowników
countries       pobieranie listy krajów
validation      reguły walidacji formularzy
```


## docs

Folder `docs` zawiera materiały pomocnicze do pracy i prezentacji.

## Testy

Testy znajdują się w `logic/tests`.

```text
bookings.test.ts           testy rezerwacji
comments.test.ts           testy komentarzy
images.test.ts             testy obrazków
offers.test.ts             testy ofert
offers-conversion.test.ts  testy konwersji ofert
tripAlerts.test.ts         testy powiadomień
users.test.ts              testy użytkowników
validation.test.ts         testy walidacji
```