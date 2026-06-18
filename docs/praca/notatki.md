ogólnie jest tak, 
o mnie
że jestem żeglarzem 
mam uprawnienia żeglarza jachtowego, jachtowego sternika morskiego, patenty radiowe src, lrc na wszystkie morza, oraz stcw - potrzebny do pracy na morzu
staram się również pływać w regatach
zdarzyło mi się gasić pożar i wywrócić łódkę

obecnie szuka osób do rejsu wśród znajomych, na facebooku grupach
są także serwisy do szukania załóg/kapitana, ale nie są wystarczające
jest też aplikacja oak.app - do szukania ludzi na wyprawy górskie

ja chcę zrobić aplikację, która pozwoli łatwo szukać rejsów, budować zaufaną sieć kontaktów, by 
1. czuc się pewniej, że trafimy na spoko ludzi na rejsie, w końcu musimy z nimi spędzić conajmniej tydzień na maleńkiej przestrzeni
2. mieć wygodną przestrzeń wyszukiwania propozycji na nadchodzacy wypoczynek
3. cały ten proces powinien być jak najwygodniejszy



lista z ii bym widział czy wszystko jest

Program i/lub system informatyczny realizujący określone zadanie użytkowe
Podstawą pracy tego typu jest stworzony przez autora/autorów pracy program lub system komputerowy wymagający nakładu pracy porównywalnego z semestralnym projektem programistycznym (30 godzin zajęć dydaktycznych i 60 godzin pracy samodzielnej). Do pracy tego typu powinny być załączone źródła a zadaniem autora pracy jest także udostępnienie działającej instalacji programu/systemu. System/program komputerowy powinien być uzupełniony częścią pisemną o objętości 10-20 stron formatu A4. W części tej powinny znaleźć się następujące elementy:


<!-- - Opis i analiza zagadnienia stanowiącego temat pracy. : 04, 05 -->
- Porównanie z innymi znanymi rozwiązaniami (implementacjami).
    - https://www.findacrew.com/
    - crewly.pl
    - https://www.facebook.com/groups/SailingCrewFinderWholeWorld/
    - https://wolna-koja.pl/
    - https://www.facebook.com/groups/262932323873709/
    - https://www.coboaters.com/en/
    - https://sailties.net/
    - https://www.crewbay.com/boats/professional?keyword=professional&group=boats
- Opis zastosowanych/wynalezionych rozwiązań, czyli to, czym student chce się w projekcie pochwalić.
(ten akapit jest pomijany dosłownie zawsze, w pewnym sensie jest on zawarty w całości pracy, trochę tu, trochę tam)

<!-- Część dla użytkowników:
- ogólny opis, do czego służy program
- sposób instalacji lub dostępu do działającego systemu
- podręcznik użytkownika
- Przypadki użycia demonstrujące reprezentatywnie system/program. -->

Część dla programistów, w tym wykaz narzędzi użytych w projekcie, z uzasadnieniem wyboru oraz opis struktury projektu, ewentualnie, dokumentacja (jeśli nie jest częścią źródeł)


\section{Instrukcja instalacji i uruchomienia}

Aplikacja jest dostępna online pod domeną \texttt{https://dsadsa.boats/}. Jeżeli jednak użytkownik chciałby uruchomić system lokalnie, może skorzystać z poniższej instrukcji.

Poniższa instrukcja opisuje lokalne uruchomienie systemu krok po kroku.

\begin{enumerate}
    \item Pobranie projektu
    \begin{itemize}
        \item Sklonuj repozytorium:
        \item \texttt{git clone https://github.com/antonitomaszewski/Sindbad}
        \item \texttt{cd Sindbad}
    \end{itemize}

    \item Pobranie i uruchomienie PocketBase
    \begin{itemize}
        \item Pobierz PocketBase zgodnie z dokumentacją PocketBase Docs \cite{pocketbase-docs}.
        \item Uruchom serwer PocketBase: \texttt{./pocketbase serve}
    \end{itemize}

    \item Import bazy danych do PocketBase
    \begin{itemize}
        \item Zaloguj się do panelu administracyjnego PocketBase.
        \item Zaimportuj plik eksportu bazy (JSON) dostępny w repozytorium.
        \item W tym miejscu należy dodać zrzut ekranu z panelu importu.
    \end{itemize}

    \item Konfiguracja Google OAuth (logowanie Google)
    \begin{itemize}
        \item Utwórz dane OAuth w Google Cloud Console (GCC) \cite{google-cloud-console}.
        \item Skonfiguruj poprawnie URI przekierowań dla środowiska lokalnego i produkcyjnego.
        \item Wklej \texttt{Client ID} i \texttt{Client Secret} do ustawień OAuth w PocketBase (kolekcja \texttt{users}).
        \item W tym miejscu należy dodać zrzut ekranu konfiguracji OAuth w PocketBase.
    \end{itemize}

    \item Konfiguracja Resend (wysyłka maili)
    \begin{itemize}
        \item Załóż konto w Resend i wygeneruj klucz API dla aplikacji.
        \item Uzupełnij konfigurację Resend w pliku \texttt{.env} projektu.
        \item Uzupełnij ustawienia \texttt{SMTP/Mail} w panelu PocketBase.
        \item W tym miejscu należy dodać zrzut ekranu ustawień \texttt{Mail Settings} w PocketBase.
        \item Aby wysyłać wiadomości na zewnętrzne skrzynki (nie tylko adres rejestracyjny), skonfiguruj własną domenę w Resend.
    \end{itemize}

    \item Uzupełnienie pliku środowiskowego
    \begin{itemize}
        \item Utwórz plik \texttt{.env} na podstawie \texttt{.env.example}.
        \item Uzupełnij wszystkie wymagane wartości.
    \end{itemize}

    \item Instalacja zależności i uruchomienie aplikacji
    \begin{itemize}
        \item \texttt{npm install}
        \item \texttt{npm run dev}
    \end{itemize}
\end{enumerate}


