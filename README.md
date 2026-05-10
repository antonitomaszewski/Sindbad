# Sindbad
Giełda sportów wodnych. Do łączenia ludzi z wydarzeniami


### Notatki

1. git clone git@github.com:antonitomaszewski/Sindbad.git
2. cd Sindbad
3. git config user.email "moj@email.com"



Robimy MVP, staramy się korzystać z najbardziej wysokopoziomowych struktur, wysokopoziomowych serwisów.
Do maili: resend
do bazy i autentykacji: pocketbase

1.02.2026 - nadal żyję
29.04.2026 cisnę


ZROBIONE
<!-- 1. logowanie użytowników, tworzenie konta 
    google auth - trzeba użyć linku http://localhost:3000/redirect -->
<!-- 2. tworzenie ofert przez zalogowanych użytkowników -->
<!-- 3. edycja profilu użytkownika -->
<!-- 3. gdy mamy potwierdzoną rezerwację, to powinniśmy zmieniać licznik dostępnych miejsc -->
<!-- 4. mail w momencie zrobienia rezerwacji przez klienta - dostaje użytkownik  -->
<!-- 7. mail w momencie zmiany statusu przez organizatora, wtedy wysylamy dane do platności i nr konta -->
<!-- 6. mail w momencie zrobienia rezerwacji przez klienta. -   organizator -->
<!-- 10. obecnie mimo, ze jest 0 miejsc dostępnych, to mozna złozyc rezerwację - to jest niedobrze, takze organizator moze potwierdzić taką rezerwację -- to także jest niedobrze. -->
<!-- 12. weryfikacja maila - verified: false/true narazie działa jedynie dla betylhiro@gmail.com, potrzebowałbym swojego osobnego DNS, domeny -->
<!-- 11. zmiana maila, zmiana hasła na profilu -->
<!-- profil oferty zawiera liczbę dostępnych miejsc -->


dobra, zastanówmy sie co trzeba dorobić
4. opcję dostawania powiadomienia, gdy pojawi się rejs w terminie/miejscu, który nas interesuje (czyli tworzenie takich zgłoszeń/marzeń)
wtedy dostawalibysmy powiadomienia mailowe
4. można zrobić public/private zamiast tych relacji kiedy wyswietlać rejsy a kiedy nie
5. wśród znajomych - mamy strava activities, czyli poprostu miejsce, by wrzucić relację, 
8. mail z zapytaniem
9. uzytkownik może zapisac swoje marzenia: kraj, termin, organizator
9. mail z wyszukiwaniem do uzytkownika: kraj, termin, organizator
13. użytkownik, który ma potwierdzoną rezerwację / jest organizatorem -- widzi jacy inni użytkownicy są zapisani (to nie zmienia ich private/public profilu)





wysyłkę maili załatwia resend, ma do tego gotowe funkcje

rejestrujemy się na istniejący mail - Failed to create record.
logujemy sie na konto niezweryfikowane/nieistniejące - Invalid credentials