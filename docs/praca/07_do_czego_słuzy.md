# Program



x.1 wstęp
1. Sindbad to internetowa platforma, która ma pomóc w organizacji rejsów.
2. Jest przeznaczona dla osób chcących zorganizować rejs, dołączyć się do załogi niezależnie od doświadczenia i umiejętności oraz chętnych do poznania nowych zaufanych ludzi i bycia częścią społeczności. 
3. Ma ułatwić planowanie wakacji i sprawić że będziemy się czuć bezpieczniej.

X.2 Role
Mamy de facto 2 różne możliwe typy uzytkowników.
Niezalogowany (gość) - ma dostęp do wszystkich ofert rejsów, ale nie do profili użytkowników.
Może wysłać zapytania do organizatora, ale by dokonać rezerwacji musi zarejestrować konto w serwisie.
Zalogowany (użytkownik) - ma dodatkowo możliwość wysłania rezerwacji, tworzenia oferty rejsu, dostęp do profili publicznych, oraz prywatnych z którymi był już na wspólnym rejsie
Użytkownik, który utworzył ofertę rejsu ma możliwość przyjmowania i odrzucania rezerwacji.

X.3 Strona główna
Strona główna pełni funkcję strony powitalnej. Wyświetla liczbę dostępnych rejsów oraz liczbę zarejestrowanych użytkowników.

Użytkownik może przejść do wyszukiwania rejsów lub dodać nową ofertę

X.4 Rejestracja i Logowanie
Funkcje logowania i rejestracji są dostępne w górnej części interfejsu, po prawej stronie paska nawigacyjnego.

Podczas rejestracji użytkownik może utworzyć konto na dwa sposoby: poprzez podanie adresu e-mail i hasła lub za pomocą  konta Google.

System przeprowadza walidację danych wprowadzanych w formularzu. W przypadku wykrycia błędów wyświetlany jest odpowiedni komunikat, np. gdy podane hasła nie są identyczne, konto dla wskazanego adresu e-mail już istnieje lub hasło nie spełnia wymagań dotyczących długości.


X.5 Wyszukiwanie ofert
System udostępnia trzy widoki wyszukiwania ofert: listę ofert, mapę oraz kalendarz. Do każdego z nich jest dostęp z paska nawigacyjnego.

Główny widok wyszukiwania to lista ofert. Oferty prezentowane są w formie kafelków wraz z rozbudowanym zestawem filtrów.

Widoki mapy i kalendarza stanowią alternatywny sposób przeglądania ofert. Zawierają uproszczony zestaw filtrów, ponieważ ich głównym celem jest wizualna prezentacja danych. W widoku mapy oferty przedstawiane są w postaci pinezek na mapie, a filtrowanie jest możliwe między innymi według daty i ceny.

Z każdego widoku użytkownik może przejść do szczegółów wybranej oferty.


X.6 Szczegóły oferty
Widok szczegółów oferty zawiera informacje o rejsie, takie jak tytuł, opis, termin, lokalizacja, liczba dostępnych miejsc oraz cena.

Na stronie prezentowane są również informacje o organizatorze i zapisanych uczestnikach. Jeżeli profil użytkownika jest publiczny, możliwe jest przejście do jego profilu. Dodatkowo dostępna jest galeria zdjęć związanych z ofertą.

W dolnej części strony znajdują się opcje wysłania zgłoszenia rezerwacyjnego, zadania pytania organizatorowi oraz utworzenia powiadomienia o podobnych wydarzeniach.


X.7 Formularz rezerwacji i zapytania
Formularze rezerwacji i zadawania pytań dostępne są z poziomu widoku szczegółów oferty. Użytkownik podaje swoje imię, nazwisko, adres e-mail oraz treść wiadomości. Po wysłaniu formularza organizator otrzymuje powiadomienie e-mail z danymi zgłoszenia, a użytkownik dostaje potwierdzenie wysłania.


X.8
Ofertę może utworzyć każdy zalogowany użytkownik. Formularz wymaga podania podstawowych informacji, takich jak tytuł, termin, cena oraz lokalizacja rejsu. W przypadku braku wymaganych danych system wyświetla odpowiednie komunikaty walidacyjne.
Po utworzeniu oferta jest dostępna do wyszukania.

Organizator zarządza rezerwacyjnymi w widoku danej oferty. Wiadomości e-mail dotyczące rezerwacji zawierają odnośnik do odpowiedniej oferty, co ułatwia ich obsługę.

Każde zgłoszenie może zostać zaakceptowane lub odrzucone. Po podjęciu decyzji system automatycznie wysyła wiadomość e-mail do uczestnika z informacją o wyniku rezerwacji.

X.9
Profil użytkownika zawiera podstawowe informacje o danej osobie, takie jak opis, zdjęcia oraz posiadane uprawnienia żeglarskie.

Prezentowana jest również historia aktywności użytkownika zawierająca: zorganizowane rejsy, opinie oraz informacje o uczestnikach, z którymi żeglował, wraz z rejsami, podczas których nawiązano te relacje.
Po zakończonym rejsie uczestnicy mogą dodać opinię o rejsie i organizatorze – opinia ta jest widoczna zarówno na stronie oferty, jak i na profilu organizatora.

Informacje te pozwalają budować społeczność - możemy żeglować z  osobami co do których czujemy się pewnie. Jest to szczególnie istotne, ponieważ w żeglarstwie ludzie często spędzają razem wiele dni lub tygodni w ograniczonej przestrzeni.

Właściciel profilu może go edytować oraz zarządzać ustawieniami prywatności. Profil publiczny jest widoczny dla wszystkich zalogowanych użytkowników, natomiast profil prywatny jest dostępny wyłącznie dla osób, z którymi był wcześniej na rejsie. Ma również dostęp do konfiguracji powiadomień interesujących go rejsów w przyszłości.

X.10
System wysyła wiadomości e-mail przy złożeniu rezerwacji, zmianie jej statusu oraz przy pytaniu do organizatora. W zależności od sytuacji odbiorcą jest organizator, uczestnik lub oboje.

X.11
Rozdział ten przedstawił funkcjonalności aplikacji Sindbad z perspektywy użytkownika. Program jest dostępny pod linkiem https://iiuwr.boats, a kod źródłowy na GitHubie: https://github.com/antonitomaszewski/Sindbad.



