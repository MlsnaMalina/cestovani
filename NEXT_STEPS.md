# NEXT_STEPS — plán pokračování

Aktualizováno 10. 9. 2026. Poslední funkční požadavky jsou splněné; další model nemá znovu implementovat známky ani výlety. Bez nového zadání nejprve ověřit stav a stručně vysvětlit možnosti dalšího pokračování. Níže jsou konkrétní kroky, nikoli automatická autorizace nových funkcí nebo placených služeb.

## Nutné kroky při převzetí

### N1 — načíst kontext a ověřit pracovní větev

- **Co:** přečíst PROJECT_CONTEXT, CURRENT_STATE, DO_NOT_CHANGE, SESSION_SUMMARY a tento soubor. Zjistit `git status --short`, `git branch --show-current`, `git log -5 --oneline` a remote. Před editací načíst aktuální `origin/main`, pokud je síť dostupná; neukládat nic přes cizí necommitované změny. Ve worktree nejprve ověřit, že není pozadu za main.
- **Proč:** předejít práci nad starým checkoutem nebo záměně designové varianty A za rodinou zvolenou cestu A.
- **Kde:** kořen projektu, sedm handoff dokumentů, Git; starší `context.md` používat jako chronologii.
- **Hotovo:** model správně shrne aktuální funkce, neznámé skutečnosti a poslední commit; pracovní větev i případné cizí změny jsou známé.

### N2 — zachovat uživatelčin uložený plán při ověřování

- **Co:** při dalším runtime testu nejdříve zjistit přes UI, zda uživatelka od předání něco vybrala nebo zapsala. Testovací nákupy nesmějí přepsat skutečné. Použít izolovaný testovací profil, je-li dostupný, nebo přesně vrátit jen vlastní testovací změny.
- **Proč:** localStorage je jediným místem uložení; Git neobsahuje osobní plán ani nákupy.
- **Kde:** UI rozpočtu, nastavení a itineráře; klíč `jedeme-spolu-v1` nevymazat jako způsob „opravy“.
- **Hotovo:** po testu je skutečný plán, kurz, palivo a nákupy beze změny. Původní prázdný stav platil pouze při tomto předání, ne navždy.

### N3 — hotovo 10. 9. 2026: veřejné nasazení ověřeno

- GitHub `MlsnaMalina/cestovani` byl už propojen s Vercel (projekt `cestovani`, účet `mlsnamalinas-projects`) — dřívější dokumentace to mylně uváděla jako nedoložené. Push `510b0b5` spustil automatický deploy, stav `Ready`.
- Živá URL: **https://cestovani-orpin.vercel.app**. Smoke test proveden: mapa a všech 6 variant první etapy, detail trasy (prohlížení nemění plán), Náš rozpočet (prázdný stav i po zápisu/odebrání testovací rakouské známky), WC/Benzín výchozí vypnuté, mobilní šířka 375 px bez vodorovného přetečení, produkční CSP hlavičky přítomné (`content-security-policy` se `self`/OSM dlaždicemi) a nic neblokují, konzole bez chyb.
- Testovací záznam známky byl po ověření z UI odebrán; žádný testovací plán nezůstal uložený v tomto prohlížeči (jde stejně o jinou instanci prohlížeče než telefon uživatelky).
- **Zbývá:** D1 — test na fyzickém Androidu (dosud jen emulace 375 px v prohlížeči).

### N4 — před skutečným odjezdem ověřit proměnlivé údaje

- **Co:** z oficiálních zdrojů prověřit platné tarify, uzavírky na zvolených koridorech, provoz lanovky a vybraných výletů. U hostitele rodina potvrdí konkrétní vjezd/parkování u obou ubytování. Model bez výslovného pokynu hostiteli nic neposílá.
- **Proč:** uložená geometrie není garancí aktuální průjezdnosti, data 8.–10. 9. mohou zastarat.
- **Kde:** odkazy v `data/sources.mjs`, `data/excursions.json`, ASFINAG/DARS/HAC/AZM/promet.si a oficiální atrakce. U případné změny ceny upravit zdroj, datum i odvozené výstupy.
- **Hotovo:** konkrétní vybrané koridory/místa mají aktuální doložené údaje nebo výslovně ponechanou nejistotu. Datum ověření se nezmění bez skutečné kontroly. Nevyžaduje znovu stahovat všechny routy.

## Doporučené kroky

### D1 — zkontrolovat reálný Android

- **Co:** po získání přístupné URL otestovat v Chrome na Androidu mapové přiblížení/posun, kliknutí na blízké značky, otevření/zavření detailu, datum a cenu známky, výběr trasy a obnovení stránky.
- **Proč:** doposud je doložený pouze prohlížečový viewport 375 px, ne fyzický telefon.
- **Kde:** telefon uživatelky; localhost počítače v telefonu nefunguje jako tentýž server.
- **Hotovo:** zaznamenaný výsledek na skutečném zařízení; případná chyba je reprodukovaná a znovu ověřená po opravě. Úpravy drží schválený vzhled.

### D2 — doplnit konkrétní neověřené údaje vybraných výletů

- **Co:** podle zájmu rodiny dohledat přesné parkovné, dostupnost WC a otevírací dobu konkrétního místa. U Paklenice ověřit nájezd/výjezd a příslušné mýto; u Veliké planiny tarif pětiletého dítěte. Neprohlašovat všechna místa za otevřená.
- **Proč:** aktuální UI poctivě ukazuje tyto mezery; ověřený údaj umožní lepší volbu.
- **Kde:** `data/excursions.json`; při změně bodu také `scripts/acquire-excursions.mjs` a výstupní routing. Ceny psát kompatibilně s `CurrencyText`.
- **Hotovo:** doplněný údaj má primární zdroj a datum; detail jej zobrazí v obou měnách. Chybějící údaj zůstává označený, pokud se jej nepodaří doložit.

### D3 — při každé další funkční úpravě ověřit dotčený scénář

- **Co:** spustit vhodné testy a build, pak původní scénář skutečně provést v běžící aplikaci. U výpočtů známek zachovat příklady SI12–18/vrácení16, AT10 platná, AT1 vypršela, průjezd po půlnoci, výměna trasy a reload.
- **Proč:** samotné zelené sestavení nedokazuje správnou částku ani funkční formulář/mapu.
- **Kde:** `src/*test*`, `scripts/photos.test.mjs`, localhost nebo skutečná produkční URL podle úkolu.
- **Hotovo:** odpovídající automatické kontroly a runtime scénář projdou, cizí plán zůstane zachovaný, výsledek je zapsaný. Při pouhé dokumentační úpravě není nutné opakovat celou funkční sadu.

## Volitelné kroky — pouze po novém zadání

| Krok | Co a proč | Kde | Kritérium dokončení |
|---|---|---|---|
| V1 — export/import plánu | Přenos mezi prohlížeči bez účtů. Nejprve dohodnout rozsah; není nyní slíben. | `Settings`, `restore()`, UI nastavení, nové testy. | Validovaný export/import zachová ID tras, pauzy, nákupy, kurz; poškozený soubor nepoškodí existující plán. |
| V2 — zahrnutí místních výletů do rozpočtu | Jen pokud rodina chce i rozpočet pobytu. Nezaměnit výlet za odbočku přejezdové etapy. | Nový model výběru výletů, `Excursions.tsx`, `planning.ts`. | Výlet má den, vlastní kilometry/mýto, jasné započítání jednou; původní přejezdy se neposunou bez důvodu. |
| V3 — reprezentativnější snímek Biogradu | Vyměnit přístavní snímek za doloženou promenádu/pláž, pokud o to uživatelka stojí. | `photo-selection.mjs`, `acquire-photos.mjs`, manifest a kredity. | Skutečné místo, doložená licence/autor, nový snímek ověřen vizuálně a přibalen; žádný vymyšlený pohled. |

## Praktické spuštění při převzetí

V PowerShellu v kořeni projektu. Závislosti instalovat jen pokud chybí nebo se změnil lockfile; neběží-li server, spustit preview:

```powershell
Set-Location -LiteralPath 'C:\Users\merit\OneDrive\Dokumenty\ChatGPT\Mapa-dovolená'
git status --short
git log -5 --oneline
# Pouze je-li instalace potřeba:
npm.cmd ci
# Pro ověření funkční změny:
npm.cmd test
npm.cmd run build
# Jen pokud port 4174 již nepoužívá existující preview:
npm.cmd run preview -- --port 4174
```

Pro editaci s automatickou obnovou použít `npm.cmd run dev` a URL z terminálu, obvykle 5173. Port 4173 patří historickým konceptům. Po ověření změny commit/push `main` podle globálních pravidel; při skutečném deployi pak znovu ověřit veřejnou URL.
