# Sindbad
Giełda sportów wodnych. Do łączenia ludzi z wydarzeniami


### Notatki

1. git clone git@github.com:antonitomaszewski/Sindbad.git
2. cd Sindbad
3. git config user.email "moj@email.com"
4. npx tsc


Warto mieć układ gałęzi sensowny:
master:
+ week_1
   + Dzień 1 tydzień 1
   + day_1_week_1
+ week_2

itd
dzięki temu jestem w stanie domergowywać mniejsze zmiany, tworzę takie drzewko mergowania


### Sindbad Plan

1. Ustalenie podstawowych założeń
+ Cel: Platforma webowa do rezerwacji rejsów na jeziorach i morzach.
+ Użytkownicy:
+ Gość (może przeglądać oferty)
+ Użytkownik (może rezerwować, oceniać)
+ Organizator (może dodawać oferty)
+ Admin (opcjonalnie, do zarządzania całością)
+ Podstawowe funkcjonalności:
+ Rejestracja/logowanie użytkowników i organizatorów
+ Przeglądanie i wyszukiwanie ofert rejsów
+ Rezerwacja miejsc
+ System ocen i opinii
+ Powiadomienia (np. o zmianie statusu rezerwacji)
+ (Opcjonalnie) Płatności online
2. Technologie
+ Backend: Node.js + Express + TypeScript
+ Frontend: (na razie pomijamy, skupiamy się na API)
+ Baza danych: Na początek prosta (np. plik JSON lub in-memory), potem np. MongoDB lub PostgreSQL
+ Testy: np. Jest lub inny framework testowy
3. Etapy pracy (każdy krok osobno, testujemy po kolei):
+ Inicjalizacja projektu
+ Utworzenie repozytorium, plików konfiguracyjnych, pierwszego endpointu testowego (np. /ping)
+ System użytkowników
+ Rejestracja i logowanie użytkownika (bez organizatora na początek)
+ Prosta walidacja i przechowywanie użytkowników
+ Oferty rejsów
+ Dodawanie i przeglądanie ofert (na razie bez rezerwacji)
+ Rezerwacje
+ Możliwość rezerwacji miejsc na rejs
+ Oceny i opinie
+ Dodawanie ocen do rejsów
+ Powiadomienia
+ Prosty system powiadomień (np. konsolowy lub e-mail)
+ Płatności
+ Integracja z systemem płatności (opcjonalnie, na końcu)
+ Refaktoryzacja i testy końcowe
4. Zasady pracy
+ Każda nowa funkcjonalność to osobny commit i osobny etap.
+ Po każdym kroku testujemy działanie (np. przez Postmana lub testy automatyczne).
+ Dokumentujemy postęp i decyzje.
+ Zaczynamy od najprostszej wersji, potem rozbudowujemy.














## Instalacje

npm init -y
npm install --save-dev typescript @types/node
npx tsc --init
npm install express
npm install --save-dev @types/express

npx ts-node src/app.ts
http://localhost:3000/ping

w pliku app.ts ustawiamy wszsytkie ROutes i w sumie to tyle
w types/index.js definiujesz swoje typy

npm install uuid
npm install --save-dev @types/uuid

### Testy

curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"tajnehaslo"}'

  curl -X POST http://localhost:3000/api/cruises \
  -H "Content-Type: application/json" \
  -d '{"name":"Mazury Tour","description":"Rejs po Mazurach","date":"2025-07-01T10:00:00Z","location":"Mazury","availableSeats":10,"organizerEmail":"org@example.com"}'