# FILES_AND_MATERIALS — inventář a návaznosti

Kontrola souborů: 10. 9. 2026. Všechny relativní cesty níže jsou vůči **`C:\Users\merit\OneDrive\Dokumenty\ChatGPT\Mapa-dovolená`**. Veřejná kopie: [GitHub](https://github.com/MlsnaMalina/cestovani). Soukromé nastavení prohlížeče v repozitáři není.

## Hlavní dokumenty v kořeni

| Soubor | Účel a použití |
|---|---|
| `PROJECT_CONTEXT.md` | Hlavní úvod, cíl, uživatelé, cesta a preference. Číst jako první. |
| `SESSION_SUMMARY.md` | Historie požadavků, rozhodnutí, problémy a ověření posledních změn. |
| `CURRENT_STATE.md` | Přesný současný stav, datový tok, výpočty, ukládání, slabá místa. |
| `NEXT_STEPS.md` | Konkrétní prioritizovaný plán a kritéria hotovo. |
| `FILES_AND_MATERIALS.md` | Tento inventář zdrojů, výstupů a materiálů. |
| `PROMPT_FOR_NEXT_MODEL.md` | Samostatně použitelný zadávací prompt a rychlý start. |
| `DO_NOT_CHANGE.md` | Schválené chování a věci vyžadující potvrzení před změnou. |
| `README.md` | Instalace/spuštění, obnova dat, metodika, technická konfigurace. |
| `context.md` | Podrobný chronologický deník. Historické stavy nebrat jako aktuální. |

Sedm názvů handoff dokumentů zachovat přesně: další prompt na ně odkazuje. Při nové práci aktualizovat relevantní stav a deník, nepsat rozporné souběžné verze.

## Aplikační zdroje — `src/`

| Soubor | Odpovědnost / místo pro úpravy |
|---|---|
| `main.tsx` | Vstup React aplikace a připojení stylů. |
| `App.tsx` | Načtení trip.json, Planner, lokální stav a uložení, etapy, karty, denní itinerář, rozpočet, zdroje a původní detail zastávek. |
| `MapView.tsx` | MapLibre, worker, souběžné geometrie, markery, skupiny a přizpůsobení výřezu mapy. |
| `planning.ts` | Temporal, časy/ETA, palivo, mýto, známky, mezní ceny, rozpočet a validovaná obnova nastavení. |
| `types.ts` | Typy Route/Stage/Selection/Settings/PaidPass, služeb a výletů. ID a pořadí souřadnic jsou důležité. |
| `PaidPasses.tsx` | Záznam skutečného nákupu, platnost, cena, označení plánované známky za koupenou a odebrání místního záznamu. |
| `Facilities.tsx` | Filtry WC/Benzín, seznam dostupných míst a detaily. |
| `Excursions.tsx` | Karty a podrobný dialog výletu od ubytování, samostatný benzín tam/zpět, navigace. |
| `excursionData.ts` | Spojení výletních metadat s přijatým routingem, limit 100 min v obou směrech (od 11. 9. 2026; nad 60 min označuje `overHour()`). Nezaměnit s Excursions.tsx. |
| `HealthAdvisories.tsx` | `HazardTag`/`HazardNotes` — sdílené zobrazení zdravotních/bezpečnostních upozornění na kartách i v detailu, pro zastávky i výlety. |
| `StopPhoto.tsx` | Zobrazení JPEG, náhled/detail a kredit. |
| `Money.tsx`, `currency.ts` | Kontext kurzu, vykreslení Kč/EUR a převod cen v textu. |
| `Controls.tsx` | Dialog a validovaný číselný vstup. |
| `style.css` | Schválený vzhled a responzivní pořadí. Akcent `#b72150`, pozadí bílé. |
| `vite-env.d.ts` | Deklarace Vite/asset importů. |

Testy: `planning.test.ts` (itinerář/rozpočet/data/čas), `paidPasses.test.ts` (platné/expirované/skutečně koupené známky), `Facilities.test.ts` (služby/filtry), `excursions.test.ts` (hodinový limit/příjezdy/metadata), `currency.test.tsx` (měny a stará nastavení). Šestý testovací soubor je `scripts/photos.test.mjs` (přibalené JPEG). Celkem při posledním ověření 33 testů.

## Zdrojová data a výzkumné výsledky — `data/`

| Soubor | Typ | Účel |
|---|---|---|
| `routes.mjs` | Zdroj | Etapy/koridory, průjezdní body, názvy, barvy, známky, mýto, slovní hodnocení. |
| `places.mjs` | Zdroj | 17 původních zastávek, texty, vybavení, otevírací údaje, délky pobytu. |
| `sources.mjs` | Zdroj | Primární odkazy, poznámky a datum ověření cestovních údajů. |
| `toll-adjustments.mjs` | Zdroj | Úpravy chorvatského mýta při konkrétních sjezdech/zastávkách. |
| `destination.mjs` | Zdroj cíle | Branimirova obala 12 a GPS Apartman More. Změna vyžaduje přepočet navazujících geometrií. |
| `crosschecks.json` | Výsledek kontroly | OSRM porovnání SI koridorů A/B/D s primární Valhallou. |
| `services.json` | Přibalený výsledek | 100 WC/benzinových míst a směrové vazby, zdroje, vybavení, zajížďky. |
| `excursions.json` | Zdroj obsahu | Texty výletů, odkazy, data ověření, photoId. Obsahuje i odmítnutou Ljubljanu. |
| `excursion-routes.json` | Přibalený výsledek | 11 přijatých obousměrných výpočtů od konkrétního ubytování, GPS, km, minuty, geometrie, zdrojový dotaz. |
| `photo-selection.mjs` | Zdroj výběru | Commons názvy a popisky fotografií. |
| `photos.json` | Manifest/výstup | Cesta k JPEG, alt/caption, autor, licence a zdroj. |
| `exchange-rate.json` | Datový snímek | ČNB 24,25 CZK/EUR k 9. 9. 2026, zdroj. Ruční nastavení uživatele je zvlášť v prohlížeči. |

Tarify, fotografie ani provozní fakta nejsou automaticky čerstvá jen proto, že se aplikace znovu otevře. Při aktualizaci změnit původní zdroj a související výstup, datum pouze po skutečném ověření.

## Veřejné přibalené výstupy — `public/`

`public/data/trip.json` je hlavní runtime balík načítaný App.tsx. Samostatné GeoJSON soubory slouží také odkazům na geometrii:

- SI: `si-a.geojson`, `si-a-smooth.geojson`, `si-b.geojson`, `si-b-smooth.geojson`, `si-c.geojson`, `si-d.geojson`.
- HR: `hr-a.geojson`, `hr-b.geojson`, `hr-c.geojson`.
- Návrat: `home-a.geojson`, `home-b.geojson`, `home-c.geojson`.

Odpovídající route ID zachovat; `*-smooth` se v UI zobrazují jako A₂/B₂. Změna ID by narušila uložené plány a vazby služeb.

`public/photos/` obsahuje **27 JPEG**:

- Původních 17: `stromovka`, `gleinkersee`, `mikulov`, `laxenburg`, `maribor`, `friesach`, `europapark`, `mondsee`, `gmund`, `bled`, `bistrica`, `cad`, `otocec`, `fuzine`, `metlika`, `ogulin`, `trakoscan` (vše `.jpg`).
- Nových 10: `trip-arboretum`, `trip-biograd`, `trip-kamnik`, `trip-nin`, `trip-novigrad`, `trip-paklenica`, `trip-planina`, `trip-snovik`, `trip-vrana`, `trip-zadar` (vše `.jpg`). Výlet k prameni znovu používá `bistrica.jpg`.
- `CREDITS.md`: autor, zdroj a licence každého snímku. Fotografie Commons jsou přibalené zmenšeniny; CSS ořez náhledu není nová fotografie. Čad je označená ilustrace jídla.

Ikona webu je `public/favicon.svg`; další UI ikony jsou z `lucide-react`, výlety používají sluníčko. Žádná samostatná knihovna návrhů ve Figmě nebyla doložena.

## Skripty — co spouštět a co nejdřív prohlédnout

| Skript/skupina | Účel a pořadí |
|---|---|
| `acquire-valhalla.mjs` → `geocode-stops.mjs` → `acquire-stops.mjs` → `build-data.mjs` | Primární příprava tras a zastávek. Spojeno jako `npm.cmd run data:routes`; potřebuje síť a cache. Pro běžné spuštění aplikace není třeba. |
| `crosscheck-routes.mjs` | Nezávislé OSRM srovnání uložených koridorů. |
| `geocode-destination.mjs` | Pomocné ověření cíle; nepřepsat katalogový bod automaticky středem ulice. |
| `acquire-services.mjs` → `build-services.mjs` | `npm.cmd run data:services`, příprava WC/pump; předpokládá podklady tras. |
| `acquire-excursions.mjs` | Obousměrná Valhalla od ubytování, ověření přístupového bodu, odmítnutí >60 min. Při obnově vzniká `data/excursion-routes.json`. |
| `acquire-photos.mjs` | Manifest/JPEG/kredity podle photo-selection; kontroluje shodu názvu s cache. |
| `acquire-exchange-rate.mjs` | Získání kurzu ČNB. Ověřit nové datum a aktualizovat související texty. |
| `geo.mjs` | Sdílené geografické pomocné funkce. |
| `photos.test.mjs` | Test skutečných JPEG. Spouští ho Vitest. |
| `acquire-routes.mjs`, `compile-routes.mjs`, `crosscheck.mjs`, `routing-probe.mjs` | Pomocné/starší výzkumné skripty. Nejsou aktuální výchozí cestou obnovy uvedenou v package.json; před případným použitím přečíst jejich vstupy a výstupy. |

Neobnovovat hromadně data jen kvůli převzetí projektu: veřejné služby mohou odpovědět jinak a změnit ověřenou geometrii. Nejprve stanovit konkrétní důvod a zkontrolovat následný diff.

## Konfigurace, návrhy a lokální cache

- `package.json`, `package-lock.json`: závislosti, skripty, reprodukovatelné verze. `npm.cmd ci` podle lockfile; bez zadání neprovádět upgrade.
- `tsconfig.json`, `vite.config.ts`: TypeScript a Vite. `index.html`: HTML vstup. `vercel.json`: framework/build a produkční bezpečnostní hlavičky. `.gitignore`: cache, `.env`, `.vercel`, node_modules a dist.
- `concepts/1-mapa-naplno.html`, `2-cestovni-atlas.html`, `3-den-po-dni.html`: historické A/B/C. `prehled.html`, `index.html`, `prehled.png`: galerie. `serve.mjs`: lokální server 4173. `build-previews.mjs`, `build-gallery.mjs`: generování návrhů. **Tyto soubory nejsou hotová aplikace na 4174.**
- `research/`: ignorované složky `raw`, `valhalla`, `stop-routing`, `geocoding`, `crosscheck`, `services`, `photos`, `exchange`, `excursions`. Jsou pomocné cache, ne jediný zdroj runtime dat. V novém klonu jejich obsah není dostupný; přesný kompletní inventář cache nebyl součástí předání.
- `dist/`: poslední místní build; regenerovat, neupravovat ručně a necommitovat. `node_modules/`: lokální závislosti. `.git/`: pouze přes Git, žádné ruční mazání/rekurzivní přesuny.

## Původní podklady mimo Git

- Původní zadání aplikace: `C:\Users\merit\.codex\attachments\f0d131c4-55f1-4260-9cb7-e364c5e60f06\pasted-text.txt`.
- Poslední zadání této dokumentace: `C:\Users\merit\.codex\attachments\c7869e9a-b798-4eb2-a50e-250902b4d1d5\pasted-text.txt`.
- Tyto přílohy jsou lokální soubory aplikace Codex, **nejsou součástí repozitáře** a v jiné AI nemusí být dostupné. Potřebný projektový obsah je přepsaný do předávacích dokumentů. Samotná konverzace obsahuje následná uživatelská upřesnění a není exportována jako samostatný přibalený chat.
- Uživatelské globální instrukce byly předány v konverzaci; potřebné provozní mantinely jsou přeneseny do DO_NOT_CHANGE/PROJECT_CONTEXT. Skilly na původním počítači: `C:\Users\merit\.agents\skills\deploy\SKILL.md`, `...\design-directions\SKILL.md`. V jiném prostředí jejich dostupnost nevyžadovat jako samozřejmost.
- Screenshoty z prohlížeče byly zobrazené během ověřování; kompletní samostatný archiv všech runtime screenshotů není doložen. `concepts/prehled.png` je pouze konceptová galerie, ne důkaz produkčního deploye.

## Kde pokračovat a co nepřepisovat

Pro ceny začít `planning.ts` a příslušnými testy, pro obsah příslušným zdrojem v `data/`, pro UI cílenou komponentou. Zachovat route/stop/photo ID, `jedeme-spolu-v1` a názvy veřejných assetů nebo provést výslovně promyšlenou migraci. Generované trip/GeoJSON/JPEG neupravovat odděleně od zdrojů. Nikdy nepřepsat uživatelčin plán nebo současné necommitované změny jen proto, že se liší od tohoto inventáře.

- `src/Roadbook.tsx`, `src/roadbookData.ts`: rozpisy, sdílené ceny a export samostatné mapy/taháku; `src/roadbook.test.ts`: návaznost pokynů a export.
- `scripts/build-roadbooks.mjs` → `data/roadbooks.json`: generátor českých pokynů z cache původních tras a zajížděk.
