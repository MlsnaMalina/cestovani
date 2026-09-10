# CURRENT_STATE — aktuální stav k 10. 9. 2026

Funkční základ: `f97f920`, nahraný na `origin/main`. Před zahájením dokumentačního předání byl pracovní strom čistý a lokální větev shodná s evidovaným `origin/main`. Handoff soubory vznikají jako samostatná dokumentační změna; aktuální commit zjistíte příkazem `git log -1`.

## Stav funkcí

| Oblast | Aktuální chování | Stav |
|---|---|---|
| Mapa | Současné koridory etapy, detail trasy, celá dovolená, původní zastávky, služby a výlety. | Hotové, ověřené lokálně. |
| Trasy | SI 6, HR 3, domů 3. Silniční geometrii a časy poskytl Valhalla/OSM. | Přibalené datové snímky, bez živého přepočtu. |
| Itinerář | Výběr trasy, přidání/odebrání pauzy, pobyt, odjezd, rezerva, ETA a datum. | Hotové, ukládá se v prohlížeči. |
| Rozpočet | Benzín, mýto, plánované a zaplacené známky, změna při nahrazení trasy. | Hotové, otestované. |
| Měny | EUR je výpočetní měna; Kč i EUR ve výsledcích a cenových textech. | Kurz ČNB 24,25 k 9. 9. 2026; ruční změna i obnova. |
| WC/Benzín | 100 míst, 203 vazeb na směry. WC 60, benzín 57, kategorie se překrývají. | Oba filtry výchozí vypnuté; skupiny, seznam a detail fungují. |
| Původní zastávky | 17 míst, 49 vazeb ke koridorům, fotky, příjezdy, zajížďky. | Hotové. |
| Výlety od ubytování | 5 SI + 6 HR, sluníčka, přiblížení okolí, fotky, podrobnosti. | Hotové. Nepřidávají se samy do přejezdů/rozpočtu. |
| GitHub | `https://github.com/MlsnaMalina/cestovani`, `main`. | Funkční změna úspěšně pushnuta. |
| Vercel | `vercel.json` připraven. | Propojení, deployment ani veřejná URL nejsou doloženy. |
| Synchronizace/offline | Žádné účty nebo backend. | Neslíbeno a neimplementováno. |

## Rozpracované, navržené a chybějící

- **Rozpracované funkce:** žádné známé. Poslední dva požadavky — výlety a zaplacené známky — jsou dokončené.
- **Pouze připravené:** konfigurace Vercel pro statický web; její bezpečnostní hlavičky se lokálním Vite preview neuplatňují.
- **Chybějící informace:** veřejná produkční URL/projekt, potvrzení skutečného vjezdu/parkování u ubytování, některé vstupné/provozní údaje, reálné nákupy a schválené koridory rodiny.
- **Nezadané rozšíření:** synchronizace mezi telefony, export/import plánu, live doprava, přidávání místních výletů do rozpočtu. Nesmí být prezentováno jako nedodělaná část již slíbené funkce.

## Důležité výpočetní vztahy

`src/planning.ts` je hlavní výpočetní modul:

1. `itinerary(route, selection)` z vybraných zastávek přičte dobu pobytu a rozdíl silniční zajížďky; rezerva posouvá cílový příjezd. Překrývající se zajížďky nepřidávat současně.
2. `countryEvents()` odvodí místní dny průjezdu z `countryWindows` a posunů zastávkami. Není to pouze datum odjezdu; rezerva se pro konec okna uplatňuje konzervativně.
3. `passCovers()` porovnává stát a interval datum od/do včetně obou krajních dnů. `vignettePasses()` plánuje pouze dosud nepokryté průjezdy.
4. Plánuje se AT 1 den 9,60 € / 10 dní 12,80 €, SI 7 dní 16 €. Jde o tarify pro pevnou krátkou dovolenou; není to obecný optimalizátor libovolných měsíčních/ročních pobytů.
5. `budget()` = benzín + průjezdové mýto + potřebné nové známky + jednou skutečně zapsané nákupy. `remaining` nezahrnuje již zaplacené známky. Nákup je náklad i po odebrání všech tras, dokud uživatel neodebere místní záznam.
6. `comparisonCosts()` odstraní porovnávanou etapu z kopie plánu, přidá kandidáta a porovná potřebné známky s ostatními schválenými etapami. Karta ukazuje **navíc k ostatním etapám**. Tyto mezní částky různých etap se nesčítají; společný součet je v rozpočtu.
7. U dosud nekoupené AT1 může další průjezd změnit plán na AT10 za rozdíl 3,20 €. U skutečně koupené AT1 se žádný fiktivní doplatek/vrácení nepředpokládá; po expiraci vzniká nový nákup.
8. `routeToll()` vždy ponechává úsekové/chorvatské mýto. Vybrané sjezdy Ogulin a Fužine mají vlastní úpravy tarifu.

`costs()` zůstává nízkoúrovňovým výpočtem jedné trasy se zaplacenými známkami; nenahrazovat jím `comparisonCosts()` v kontextovém srovnání UI.

## Ukládání a výchozí hodnoty

Klíč localStorage: **`jedeme-spolu-v1`**. `Settings` obsahuje `consumption`, `fuelPrice`, `exchangeRate`, `paidPasses`, `departures`, `plan`. `plan` má nejvýše jednu volbu pro každou etapu; `Selection` obsahuje `routeId`, `stops` (ID → minuty pobytu), `reserve`.

- Spotřeba 8 l/100 km, benzín 1,912 €/l; editovatelné. Cena je historický rakouský průměr WKO k 7. 9. 2026, nikoli cena konkrétní pumpy.
- Odjezdy SI 04:00, HR 11:00, home 10:00 v pevných dnech.
- `paidPasses` na začátku prázdné. Vlastní záznam obsahuje stát AT/SI, `from`, `to` ve formátu YYYY-MM-DD, cenu EUR a název. Formulář nabízí běžné délky a dovoluje přepsat konec podle skutečného dokladu.
- `restore()` validuje obnovená nastavení, zachová staré plány bez `paidPasses`, odmítá neplatné/duplicitní nákupy, neplatné route ID a hodnoty mimo rozsah. Neukládat testovací nákupy za rodinu.
- WC/Benzín jsou pouze stav komponenty; po reloadu znovu oba `false`. Prohlížená mapa/detail není automaticky schválený plán.

## Struktura a tok dat

```text
src/                   React, styly, typy, výpočty a testy
data/                  zdrojové texty/tarify a přibalené výsledky průzkumu
scripts/               příprava a ověření geografických dat/fotek/kurzu
public/data/           trip.json + 12 GeoJSON pro běh a odkazy aplikace
public/photos/         27 JPEG a CREDITS.md
concepts/              historické návrhy rozhraní; nejsou běžící aplikací
research/              lokální ignorované cache; v čistém klonu chybějí
dist/                  ignorovaný výstup sestavení
node_modules/          ignorované závislosti
```

- `main.tsx` → `App.tsx` → fetch `/data/trip.json` → Planner. `MapView.tsx` se načítá líně, explicitní worker musí zůstat kompatibilní s Vite.
- `data/routes.mjs`, `places.mjs`, `sources.mjs`, `toll-adjustments.mjs` + routingové cache → `scripts/build-data.mjs` → `public/data/trip.json` a GeoJSON. Nemenit pouze export a nepřepsat ho později starým zdrojem.
- `data/destination.mjs` drží chorvatskou adresu/GPS. Změna cíle vyžaduje přepočet HR i home a kontrolu souvisejících dat, ne pouze přepsání nadpisu.
- `data/services.json` → `Facilities.tsx` a `MapView.tsx`. Vazby jsou směrové, nelze mechanicky kopírovat opačný směr.
- `data/excursions.json` + `excursion-routes.json` → `excursionData.ts` → `Excursions.tsx` / mapa. Spojení podle ID a základny; do UI pouze obě jízdy ≤60 minut.
- `data/photo-selection.mjs` → `acquire-photos.mjs` → `photos.json`, JPEG, kredity → `StopPhoto.tsx`.
- `exchange-rate.json` → výchozí `Settings` → `ExchangeRateContext` → `Money` / `CurrencyText` a `currency.ts`.

Úplnější inventář: [FILES_AND_MATERIALS.md](FILES_AND_MATERIALS.md).

## Ověření a známá slabá místa

Poslední funkční build a 33 testů prošly před dokumentačním předáním. Lokální preview 4174: známky sdílené/zaplacené/expirované, reload, popupy, skupiny míst a zobrazení při 375/1280 px ověřeny; bez chyb konzole. Nejde o test veřejného nasazení ani fyzického Androidu.

- Žádná známá blokující lokální chyba. Produkční CSP a nový formulář nákupů ověřit až na skutečně nasazeném webu.
- Mapová síť potřebuje internet. Chybějící dlaždice nemusí znamenat chybu uložených tras; neodstraňovat worker jako „zjednodušení“.
- Ceny karet jsou mezní, a proto nesčitatelné. Toto omezení je napsané v UI; při změně cen zachovat vysvětlení a přesný společný rozpočet.
- U Paklenice je potřebné mýto označené, jeho přesná částka není započtená v samostatném benzínu výletu. Některá parkovná, WC a provozní údaje nejsou potvrzené.
- Foto Biogradu ukazuje přístav, nikoli přímo pláž Dražica. Foto Vranského jezera ukazuje krajinu parku, nikoli konkrétní lávku. Foto planiny může zachycovat jinou sezónu. Popisky to nesmějí zkreslit.
- `App.tsx` a některé zdrojové soubory mají dlouhé řádky. Při malé změně neprovádět plošné přeformátování ani redesign.
- `context.md` je chronologický deník: starší věty o chybějícím remote nebo samostatných cenách jsou překonané pozdějšími záznamy. Tento dokument popisuje současný stav.

Bez výslovného souhlasu neměnit adresy, termíny, volbu A + C, autonomii rodiny, výchozí filtry, dvě měny ani význam zaplacených známek. Podrobnosti v [DO_NOT_CHANGE.md](DO_NOT_CHANGE.md).
