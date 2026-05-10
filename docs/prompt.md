usuń z niego wszystko co nie jest absolutnie potrzebne do mvp
ma być maksymalnie prosto
zrobić seniorski kod, by był maksymalnie wysokopoziomowy, miał jasną strukturę, czytelny
masz pisać zawsze zwięźle, zawsze robimy TYLKO jedną rzecz w danym momencie, na tym się skupmy

"Tylko MVP. Proste funkcje. Zero abstrakcji na zapas. Potem zrefaktorujemy."

"Pisz kod tak, żeby za 6 miesięcy ktoś (albo ja) zrozumiał w 30 sekund."

"Jeśli widzisz powtórzenia – wydziel do funkcji. Nie czekaj na moją prośbę."


Programuj pragmatycznie i minimalistycznie. Priorytetem jest prostota, czytelność i szybkość iteracji dla MVP/startupu, a nie enterprise architecture.

Zasady:

* Preferuj prosty, jawny kod zamiast abstrakcji.
* Nie twórz warstw, helperów, mapperów, wrapperów i custom hooków bez wyraźnej potrzeby.
* Nie używaj overengineeringu:

  * brak CQRS
  * brak event busów
  * brak domain-driven boilerplate
  * brak factory patternów bez potrzeby
  * brak skomplikowanej dependency injection
* Funkcje powinny mieć jedną odpowiedzialność.
* Rozbijaj duże funkcje na małe helpery tylko wtedy, gdy poprawia to czytelność.
* Preferuj early returns zamiast zagnieżdżonych ifów.
* Nie ukrywaj błędów w try/catch zwracając puste arraye lub null.
* Lepiej rzucić błąd niż ukryć problem.
* Preferuj jawne query zamiast magicznych expandów i ukrytych zależności.
* 1 dodatkowy query jest lepszy niż skomplikowana architektura.
* Na etapie MVP prostota jest ważniejsza niż optymalizacja.
* Nie buduj architektury pod skalę której jeszcze nie ma.
* Kod ma być łatwy do debugowania przez jedną osobę.
* Preferuj zwykłe funkcje i proste obiekty zamiast skomplikowanych klas.
* Nie twórz typów DTO/mapowań jeśli dane mogą być użyte bezpośrednio.
* Jeśli coś jest użyte raz — nie abstrahuj tego.
* Nazwy funkcji powinny opisywać co robią:

  * validateBookingAccess
  * sendBookingEmails
  * updateAvailableSeats
* Główne funkcje powinny wyglądać jak opis flow biznesowego, a nie implementacyjne spaghetti.
* Minimalizuj coupling między komponentami.
* Unikaj ukrytej logiki i magicznych side effectów.
* Preferuj explicit over implicit.

Stack:

* TypeScript
* Next.js
* PocketBase
* Resend

Preferowana architektura:

* prosty CRUD
* client-side auth z PocketBase
* server actions tylko dla operacji wymagających sekretów lub walidacji
* minimalna liczba custom API routes
* prosty model danych
* szybkie iterowanie produktu

Priorytet:

1. działający produkt
2. prostota
3. czytelność
4. szybkość developmentu
5. dopiero później architektura i optymalizacja
