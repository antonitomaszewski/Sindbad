space-y-10 odstęp między elementami w pionie
aspect-video galeria zdjęć pozioma, jak filmik z YT a nie kwadratowa
rounded-2xl - zaokrąglenie ramek
p-X - padding ze wszystkich stron
text-3xl duży tekst
font

1. układ elementów
flex(-col/1) (rozpiętość na całość wolnego miejsca)
(block jest podobne do flex-col, ale flex-col ma odstępy między wierszami)
inline-flex (wąsko)
block (jedno nad drugim)
inline-block (wąsko)
hidden (ukryte)
grid  (każdy z podelementów też się flexuje)
flex-(col/wrap/1/shrink-0)
items-(center/start) (centrowanie dzieci, jak mamy elementy różnej wielkości, to tu decydujemy czy do góry, czy do lewej)
justify-(center/between/end) (przesuwa dzieci, gdy mamy flex)
text-(center/right/left) (centrowanie tekstu)
(md/sm-)col-span-(N) (rozpietość kolumn - jak bardzo element się rozpicha)

items(center) dzieci w osi Y
justify(center) dzieci w osi X

2. siatki
(sm/md/lg:)grid-cols-N

3. spacing
p(x/y/t/b/l/r)-N
m(l/t/b)-N
padding jest wewnętrzny = od siebie , a margin zewnętrzny, gap - oddalenie elementów od siebie
więc p ma wpływ na wielkośc elementu, a margin - na wielkość zewnętrznego elementu  
gap-N (odległości na boki)
space-(x/y)-N (odległości w pionie)

4. rozmiary
(max/min)-(w/h)-(full/N/sm/md/lg)
h-64 wysoki element
jak działają max/min i full/sm/md/lg ? 

5. czcionki
text-(xs/sm/base/lg/lg/Nxl) (wielkośc liter)
font-(medium/semibold/bold/extrabold) (grubość fontu)
tracking-(tight/wide) (odległości między literami)
leading-(N/none/relaxed) (wysokośc tekstu) (wysokość linii = odstęp między wierszami)
uppercase 
line-clamp-N (ucina tekst po N liniach i dodaje wielokropek)
whitespace-pre-wrap 
break-words (łamie bardzo duże słowa by nie rozwalały layoutu)
underline(-offset-N) (oddala linię podkreślenia od tekstu, używamy obu równoczesnie)

6. kolory
(text/bg/border)-(color)-(N)

7. ramki
(border/rounded)-(N/t/b/l/md/lg/Nxl/full)

8. cienie, przejścia
(hover:)shadow-(sm/md/lg/xl)
transition-(colors/shadow/opacity/all)
duration-N
hover:-translate-y-N (podnoszę element po najechaniu)
animate-spin
opacity-N
group-hover:opcity-100

hover:shadow + transition-shadow
translate + translation-all

9. pozycjonowanie

relative
absolute (dokładna pozycja względem rodzica) (absolute działa względem ostatniego rodzica z relative)
fixed (navbar, layout - niezależnie od scrolla)
sticky (przykleja po scrllu)

inset-N (inset-0 rozciągnij na całego rodzica)
(top/left/right)-N 
z-N (warstwa, wyższe z-index przykrywa niższe)
-translate-x-1/2 (przesuwa o połowę własnej szerokości)

10. przepełnienie, media
overflow-(hidden/y-auto)
overflow-hidden ucina to co wychodzi poza element

object-cover (zdjęcie wypełnia kontener bez rozciągania, przycina)
object-contain (zmienia proporcje do ramki)

aspect-[1/1] (ramki zdjęć)
select-none (blokuje zaznaczanie tekstu - logo sindbad)

11. stan
hover/focus/disabled/group-hover/file
prefiksy używane z dowolną klasą
disabled:opacity-50 (ograniczam prezroczystość gdy disabled)

12. dopasowywanie się do rozmiarów (mobile)
sm/md/lg:

+ grid-cols, px/p

13. klasy projektowe
dodatkowe zmienne z colors.css


htmlfor łączy label z input przez id
htmlFor="name"
input.id="name"
klikam na opis - focus przechodzi na textarea



div
span
p
button
link
input
textarea
label
form
section
article
header
footer
nav
main
ul
li
img
h1

