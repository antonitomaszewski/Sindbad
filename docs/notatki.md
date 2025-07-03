tworzenie nowej aplikacji next.js (front)
npx create-next-app .


puszczamy pocketbase mimo ze nie jest wśród zaufanych aplikacji apple
chmod +x pocketbase
xattr -d com.apple.quarantine pocketbase
./pocketbase serve

testy logic user
npx ts-node logic/tests/users.ts
po zmianie z commonjs na esnext (zainstalowaniu next) nalezy puszczać:
npx vitest logic/tests/offers.test.ts
node logic/tests/users.ts

testy wszystkie (dodany skrypt do package.json)
npm test

obecnie wszystkie testy zapisują się bezpośrednio w bazie, nie jest to najbardziej eleganckie rozwiązanie, ale trudno
Inna kwestia jest taka, ze brakuje nam w API metody do weryfikacji maila, to musimy jeszcze obsłuzyć

przydatny artykuł, w którym mozna przeczytać o strukturze projektu:
https://nextjs.org/docs/app/getting-started/project-structure


nie jesteśmy w stanie zamieścić nasz folder look/app jako katalog ściezek, potrzebujemy więc zrobić obejście: app to będzie lukier syntaktyczny dla look/app
