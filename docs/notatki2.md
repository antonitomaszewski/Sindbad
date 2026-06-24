

<!-- Robimy MVP, staramy się korzystać z najbardziej wysokopoziomowych struktur, wysokopoziomowych serwisów.
Do maili: resend
do bazy i autentykacji: pocketbase -->

<!-- 1.02.2026 - cisnę
29.04.2026 cisnę
21.05.2026 - cisnę, już jestem na finiszu. Drobne poprawki i tyle. Będzie niedługo skończone. Niedługo już koniec tych męk inżynierskich. Wystarczy dograć  -->


ZROBIONE
<!-- 1. logowanie użytowników, tworzenie konta 
    google auth - trzeba użyć linku http://localhost:3000/redirect https://console.cloud.google.com/auth/clients/586438269584-mf98j9mfk6nlhh3pv86mtgvdcurdfnpt.apps.googleusercontent.com?project=sindbad-494815 -->
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
<!-- 4. można zrobić public/private zamiast tych relacji kiedy wyswietlać rejsy a kiedy nie -->
<!-- 13. użytkownik, który ma potwierdzoną rezerwację / jest organizatorem -- widzi jacy inni użytkownicy są zapisani (to nie zmienia ich private/public profilu) -->
<!-- 9. uzytkownik może zapisac swoje marzenia: kraj, termin, organizator -->
<!-- 4. opcję dostawania powiadomienia, gdy pojawi się rejs w terminie/miejscu, który nas interesuje (czyli tworzenie takich zgłoszeń/marzeń) wtedy dostawalibysmy powiadomienia mailowe -->
<!-- 9. mail z wyszukiwaniem do uzytkownika: kraj, termin, organizator -->
<!-- 8. mail z zapytaniem (to jest drobnostka, można usunąć jeśli nie zdążę skończyć) -->
<!-- 10. można by dodać komentarze, opinie organizatorów/rejsów -->
<!-- 6. publiczny/ prywatny działa tak, że prywatny może widzeć wspólny załogant i ty sam, a publiczny - wszyscy zalogowani -->
<!-- 11. mapa ?? (to chyba na koniec) -->
<!-- 8. po zalogowaniu przekierowuje nas na stronę http://localhost:3000/profil a powinno na stronę główną -->
<!-- 11. opisz swoje doświadczenie, styl pływania, akweny na których pływałes lub chciałbyś pływać. -->
<!-- 12. tak samo w charakterze rejsu: rodzinny, regatowy, chill, szkoleniowy -->
<!-- 9. dodać, by na profilu uzytkownika widać było osoby z którymi żeglował. -->
<!-- 8. aspekt łączenia ludzi nie jest jakoś mocno wydajny obecnie. powinienem jakoś nad tym popracować -->
<!-- Skoro osoba może nie zapłacić
to organizator, powinien mieć opcję cofnięcia potwierdzonej rezerwacji -> na odrzuconą -->
<!-- 7. resend nie działa, dopóki nie zarejestruje sobie domeny -- ale nie uważam że to jest problem, bo tamże w panelu mam rozpisane logi -->
<!-- rejestrujemy się na istniejący mail - Failed to create record.
logujemy sie na konto niezweryfikowane/nieistniejące - Invalid credentials -->
<!-- 
Jak mamy w bazie emailVisibility = False, to zawsze getUserEmail zwróci null, a przez to nie będą do danego ziomka dochodzić żadne emaile. -->
<!-- mam postawione pocketbase na railway
narazie nie mam sindbada na vercelu, ale mieć będę
potem się tym zajmnę
coś już zdziałałem
jest nieźle
wyszedłem dziś z domu, i dzieki temu sporo zrobiłem
tak dziwnie działa świat

działa mi vercel
ale narazie nie korzysta z railwaya
nie wiem co dalej
zrobiłem drobne fixy z npm, bo vercel krzyczał, a wystarczało zrobić tego upgreada w przeglądarce

https://sindbad-pocketbase-production.up.railway.app/_/#/login
https://sindbad-pocketbase-production.up.railway.app/api/health
 -->
 <!-- 20. Udało się logowanie w vercelu
trzeba było zrobić redeploy, japiernicze, tyle sprawdzania, zwłaszcza że myślałem że to klikałem
mega nie lubię DEVOPS -->
<!-- 21. można pomyśleć o walidacji formularzy na froncie
1. edycja profilu
2. tworzenie oferty -->
<!-- 22. szukaj rejsów po nazwie lub opisie -- ta część nie działa, jest do wywalenia -->
<!-- 23. Dobra, kupiłem domenę
wysyłanie maili działa
jeszcze bym musiał skonfigurowac maile w pocketbase -->
<!-- 24. settings
export collections/import collections -->
<!-- 26. mam texa, część programistyczna i uzytkownika
terz zostaje bibliografia, porónwanie rozwiazan, oraz podsumowanie pracy -->

DO ZROBIENIA
dobra, zastanówmy sie co trzeba dorobić
9. opcja zapisz rejs - <3
6. obecnie nie wyświetlam rejsów z przeszłości jako załogant (a może powinienem)
5. wśród znajomych - mamy strava activities, czyli poprostu miejsce, by wrzucić relację
10. może dodać funkcje jakie dana osoba pełniła na rejsie (1 oficer, itd) - to jest raczej miły dodatek, wazniejsze by łączyć ludzi 
11. jaka łódź, ilo osobowa. zdjęcia łodzi, o kapitanie



obecnie profile są dostępne jedynie dla zalogowanych użytkowników
jak jest po rejsie, to można dodawać komentarze, nie można wysyłać rezerwacji, ale mozna wysłać zapytanie

12. bank account number trzeba dodać do profilu organizatora / lub oferty. Gdzieś byc musi. potrzebujemy uzupełniać w mailach.





wysyłkę maili załatwia resend, ma do tego gotowe funkcje






https://railway.com/deploy/pocketbase-1
railway
pocketbase 
![alt text](image.png)
![alt text](image-1.png)
https://pocketbase-production-90c6.up.railway.app//#/pbinstal/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4MDQzMTc3NCwiaWQiOiIxc25wOTlyMTN5b3B5OHQiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.L2-jz8_BpJoV5f22yEPfGq0c4Q5eHH-mk0BFBNDTlwI



mogę kupic jeszcze iiuwr.boats
jest takze za 10zł
a prezentuje się znacznie lepiej

na profilu 
Opinie o organizatorze opwinno się wyswietlać jedynie 
gdy mamy do czynienia z organizatorem (czyli conajmniej miał jeden rejs zorganizowany)

obecnie nie wysyłamy maila do weryfikacji konta
https://console.cloud.google.com/auth/clients/586438269584-mf98j9mfk6nlhh3pv86mtgvdcurdfnpt.apps.googleusercontent.com?project=sindbad-494815



organizator powinien móc edytować ofertę ? 
czy powinien móc ją usunąć?

25. powinienem w osłudze opisać więcej o opiniach




do poprawienia w pracy

dobra, rozmawiałem z promotorem i mam poprawić coś takiego
1. we wprowadzeniu więcej napisać na temat specyfikacji, co chcemy osiągnąć od naszego projektu, że to ma być aplikacja webowa, opisać jakie funkcjonalności 


dobra, rozmawiałem z promotorem i mam poprawić coś takiego
dodać instrukcję instalacji
1. trzeba wygenerować klucz api google - by działała logowanie google (w tabeli users jak na screenshocie)
i dodać do pocketbase https://console.cloud.google.com/welcome
2. stworzenie bazy pocketbase - pobieramy pocketbase
https://pocketbase.io/docs/ tu opisane szczegóły
i następnie robimy import naszej bazy, która jest w repo
3. pobranie kodu repo z linku githuba i odpalenie w katalogu głównym npm run dev
4. konfiguracja resend: 
utworzenie konta, i wygenerowanie klucza do naszej aplikacji
który nalezy wrzucić w pocketbase, oraz w .env (wzorując się na .env.local)

by resend wysyłało maile do innych skrzynek niż ta użyta w rejestracji, trzeba skonfigurować własną domenę

trzeba to rozpisać ładnie

na telefonie powiadomienie o podobnych rejsach wychodzi poza kartke

1. jedna konwencja : autor ...
1 os liczby pojedynczej ... w niniejszej pracy dowodzimy 



npx eslint .
npx eslint . --fix