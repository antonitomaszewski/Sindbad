tworzenie nowej aplikacji next.js (front)
npx create-next-app .


puszczamy pocketbase mimo ze nie jest wśród zaufanych aplikacji apple
chmod +x pocketbase
xattr -d com.apple.quarantine pocketbase
./pocketbase serve