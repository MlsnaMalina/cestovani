# PROJECT_CONTEXT — Jedeme spolu

Stav předání: 10. 9. 2026. Funkční aplikace odpovídá commitu `f97f920` na větvi `main`. Dokumentace předání vznikla následně; nejde o novou funkční změnu.

## Orientace

Rodinný webový plánovač cesty Průhonice → Kamniška Bistrica → Bibinje → Průhonice. Porovnává smysluplné silniční koridory, jejich cenu, délku, čas, zatáčky a možnosti zastavení. Uživatelé si sami vybírají trasu a sestavují denní itinerář. Nejde o automatickou navigaci ani živou dopravní službu.

- Název v aplikaci: **Jedeme spolu**.
- Projekt: `C:\Users\merit\OneDrive\Dokumenty\ChatGPT\Mapa-dovolená`.
- GitHub: [MlsnaMalina/cestovani](https://github.com/MlsnaMalina/cestovani), produkční větev `main`.
- Poslední používaný místní náhled: `http://127.0.0.1:4174/`. Po restartu počítače nemusí běžet.
- Vercel: propojeno s GitHubem, produkční větev `main`. Živá URL ověřena 10. 9. 2026: https://cestovani-orpin.vercel.app.
- Začněte tímto dokumentem, potom [CURRENT_STATE.md](CURRENT_STATE.md) a [NEXT_STEPS.md](NEXT_STEPS.md). Závazné mantinely: [DO_NOT_CHANGE.md](DO_NOT_CHANGE.md). Historie: [SESSION_SUMMARY.md](SESSION_SUMMARY.md), podrobný starší deník `context.md`.

## Uživatelé a účel

Vlastní dovolená dvou dospělých a pětiletého dítěte. Dítě jede v protisměrné autosedačce; dítě i jedna dospělá spolujezdkyně mohou mít potíže s nevolností. Proto jsou důležité zatáčky, pravidelné pauzy a příjemnost cesty. Nejde o zdravotní hodnocení ani záruku cesty bez nevolnosti.

Uživatelka nechce, aby AI rozhodovala za rodinu. Požadavek na všechny vhodné varianty znamená ověřené odlišné koridory, nikoli všechny kombinace ulic. Nejrychlejší cesta není automaticky nejlepší; scénická cesta nemá bez vysvětlení přidat několik hodin.

## Potvrzený plán dovolené

| Etapa | Den a výchozí odjezd | Cíl a pobyt |
|---|---|---|
| `si` | 12. 9. 2026, 04:00 z Průhonic; čas upravitelný | Kamniška Bistrica 8, 1242 Stahovica, Slovinsko. GPS 46.32924, 14.585544. Check-in od 14:00, před ním případně výlet. |
| `hr` | 13. 9. 2026, přibližně 11:00 ze Slovinska | **Branimirova obala 12, 23205 Bibinje**, Apartman More. Check-in od 14:00; zastávka na oběd cestou. |
| `home` | 16. 9. 2026, 10:00 z Bibinje | Průhonice. Nejpozdější příjezd nebyl určen. |

Čas check-inu není povinným časem příjezdu. Pobyt v Bibinje trvá do 16. 9. v 10:00. V datech jsou souřadnice ve formátu `[longitude, latitude]`; Bibinje `[15.276598,44.078068]`.

Auto je Škoda Superb, benzín. Česká dálniční známka už je zakoupená. Pracovní předpoklad: běžné osobní auto bez přívěsu, AT do 3,5 t, SI 2A, HR I. Přesný model/rok a technické údaje auta nejsou zadány. Další známky lze koupit podle vybrané trasy.

## Schválený směr aplikace

- Vzhled **A „Mapa naplno“ + informace C „Den po dni“ pod mapou**. To je výběr designu, nikoli cestovní trasy A.
- Bílé pozadí, malinový akcent `#b72150`, tmavý text `#192d31`, jemné linky a světlé detaily. Světlý osobní styl; žádné béžové pozadí ani tmavý technický vzhled.
- Dominantní interaktivní mapa, všechny varianty etapy současně. Na desktopu srovnání vedle mapy, na mobilu itinerář pod mapou a srovnání níže.
- Kliknutí na trasu pouze otevře detail. Schválení proběhne tlačítkem „Použít pro tento den“; přidání zastávky také výslovně použije její trasu.
- Všechny ceny v Kč i EUR, výpočty v EUR bez předčasného zaokrouhlení. Kurz editovatelný.
- Fotografie na kartách míst i v detailu; správné místo, autor a licence, ilustrační fotografie označené.
- WC a Benzín jsou při každém načtení **vypnuté**, zapínají se nezávisle ručně.
- Výlety do hodiny od obou ubytování: sluníčko v mapě → detail s fotografií a praktickými informacemi.
- Cena varianty musí zohlednit ostatní schválené etapy a skutečně zaplacené známky v době jejich platnosti.

## Technické a pracovní preference

React + TypeScript + Vite + MapLibre, lokálně přibalené ověřené silniční geometrie. Žádný účet, databáze, placený routingový klíč ani runtime generátor tras. Nastavení je v localStorage konkrétního prohlížeče.

Uživatelka není programátorka, pracuje ve Windows 11 / PowerShell a výsledky kontroluje na Androidu v Chrome. Vysvětlení mají být česky, krátce a konkrétně. Mobilní kontrola při 375 px je povinná pro změny UI; dosavadní kontrola byla emulace, ne fyzický telefon.

Dodržovat existující vizuální styl a vzorce kódu. Striktní TypeScript bez `any`, česká diakritika, data `d. m. yyyy`, časová zóna `Europe/Prague`. Výpočty přes půlnoc/DST řeší Temporal. Při zásadně novém UI uživatelka požaduje návrhové směry před implementací; u běžného pokračování již schváleného A + C znovu nevyžadovat volbu vzhledu.

Commit a push hotové ověřené práce na `main` jsou předem autorizované; autor podle aktuální globální instrukce uživatelky (k 10. 9. 2026 `zlatenkak@gmail.com`; starší `k.schmiedtova@seznam.cz` Vercel od 9. 9. 2026 neuznává). Žádné tajné klíče v kódu/Gitu, `.env` ignorovat. Technické oprávnění sandboxu k zápisu do `.git` nebo síti může být nutné i přes uživatelskou autorizaci. Další agenty nespouštět bez výslovného požadavku nebo použitelných instrukcí.

## Limity a chybějící informace

- Časy nemají živou dopravu, hledání parkování, fronty ani aktuální uzavírky. Odhad pauz není aktuální itinerář.
- Ceny a zdroje jsou snímky ověřované 8.–10. 9. 2026, nikoli automaticky aktualizované údaje. Neznámé ceny a provozní informace nesmějí být nahrazeny odhadem vydávaným za fakt.
- Přesný vjezd/parkování u Apartman More nebyl potvrzen hostitelem; souřadnice pocházejí z katalogu ubytování. U slovinského cíle mají mapová data posledních cca 500 m příznak horšího povrchu.
- Veřejná produkční URL je od 10. 9. 2026 doložená a otestovaná: https://cestovani-orpin.vercel.app. Bez fyzického Android testu (jen emulace). Není synchronizace mezi zařízeními, export/import plánu ani garantovaný offline provoz.
- Skutečná vybraná trasa a nákupy zahraničních známek nebyly rodinou potvrzeny. Testovací volby byly odstraněny; nezaměňovat je za rozhodnutí uživatelky.
- Starší adresa **Ulica Braće Radića 63** byla nahrazena. Neobnovovat ji z původních zpráv nebo souborů.
