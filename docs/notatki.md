tworzenie nowej aplikacji next.js (front)
npx create-next-app .


puszczamy pocketbase mimo ze nie jest wśród zaufanych aplikacji apple
chmod +x pocketbase
xattr -d com.apple.quarantine pocketbase
./pocketbase serve

testy logic user
npx ts-node logic/tests/users.ts
node logic/tests/users.ts

testy wszystkie (dodany skrypt do package.json)
npm test