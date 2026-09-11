# PROMPT_FOR_NEXT_MODEL

Následující blok lze celý zkopírovat jako zadání do nové konverzace. V nové AI bez přístupu k souborům přiložte také sedm dokumentů předání; pro skutečné úpravy je potřebný zdrojový repozitář. Text promptu není nutné upravovat.

```text
Převezmi projekt „Jedeme spolu“, český rodinný plánovač cesty Průhonice → Kamniška Bistrica → Bibinje → Průhonice, 12.–16. 9. 2026. Cílem je navázat na hotovou aplikaci, nikoli ji vytvořit znovu.

Projekt na původním Windows počítači:
C:\Users\merit\OneDrive\Dokumenty\ChatGPT\Mapa-dovolená
Repozitář: https://github.com/MlsnaMalina/cestovani
Větev: main. Poslední funkční commit při předání: f97f920. Novější dokumentační nebo funkční commity mohou existovat; ověř aktuální Git a nepřepisuj je.

Nejprve si přečti tyto dokumenty v kořeni projektu nebo v přílohách této konverzace:
1. PROJECT_CONTEXT.md
2. CURRENT_STATE.md
3. DO_NOT_CHANGE.md
4. SESSION_SUMMARY.md
5. FILES_AND_MATERIALS.md
6. NEXT_STEPS.md
7. PROMPT_FOR_NEXT_MODEL.md
README.md obsahuje postupy spuštění a přípravy dat. context.md je chronologický deník; jeho starší věty o nehotových funkcích či chybějícím remote mohou být překonané. Nezaměňuj historii za aktuální stav.

Pokud dokumenty nebo zdrojový projekt skutečně nemáš k dispozici, řekni konkrétně, který podklad chybí. Nevymýšlej jejich obsah a neprohlašuj, že jsi četl soubory či spustil testy bez přístupu k nim. Nečekej dostupnost původních Codex příloh, localhostu nebo lokálních skillů na jiném počítači.

Po přečtení nejdřív stručně shrň, co jsi pochopil: cíl, aktuální funkce, závazná rozhodnutí, stav nasazení a otevřené body. Potom navrhni konkrétní další postup podle NEXT_STEPS.md a posledního uživatelského zadání. Teprve poté začni pracovat v autorizovaném rozsahu. Nedělej zásadní změny bez pochopení kontextu a nevymýšlej nový rozsah jen proto, že původní funkce jsou hotové. Pro běžné čtení, ověření a autorizované opravy nevyžaduj opakovaná potvrzení.

Zásadní fakta:
- Rodina si vybírá sama, AI nesmí prosazovat vítěznou trasu. Design A + informace C pod mapou je schválený vzhled, nikoli schválení cestovního koridoru A.
- Aplikace má 12 silničních variant ve 3 etapách, 17 původních zastávek, 100 WC/benzinových míst a 11 výletů do hodiny od ubytování. Poslední požadavky na výlety a zaplacené známky už jsou implementované.
- Cíl SI: Kamniška Bistrica 8, 1242 Stahovica, GPS 46.32924, 14.585544. Cíl HR: Branimirova obala 12, 23205 Bibinje, GPS 44.078068, 15.276598. Neobnovuj původní Ulica Braće Radića 63 ani nepoužij číslo 12a.
- Odjezdy 12. 9. v 04:00, 13. 9. v 11:00, 16. 9. v 10:00; časy editovatelné, dny pevné. Check-in od 14:00 není slíbený příjezd. Všechno v Europe/Prague.
- Dva dospělí a pětileté dítě, Superb, CZ známka už koupená. Zatáčky a pauzy jsou důležité, nejde o zdravotní záruku.
- Bílé pozadí a malinový akcent #b72150, žádná béžová ani tmavý technický redesign. Čeština a Android/Chrome; UI ověřovat na šířce 375 px. Zachovej dominantní mapu a denní informace pod ní.
- WC a Benzín se při načtení vypnou; uživatel je zapíná nezávisle. Výlety mají sluníčka, fotky a podrobné popupy. Limit je 100 minut tam i zpět (zvednuto z 60 na výslovné zadání 10. 9. 2026); cokoli nad 60 minut má zřetelnou výstrahu. Ljubljana se do 100 minut vejde a je nabízená s výstrahou. Paklenica vyžaduje označenou placenou dálnici. Místní výlety se samy nezapočítávají do přejezdového itineráře/rozpočtu.
- Všechny ceny jsou v Kč/EUR; výpočet v EUR, editovatelný kurz, výchozí ČNB 24,25 k 9. 9. 2026. Data jsou historické snímky se zdroji, ne živé ceny/doprava.
- Karty tras zohledňují ostatní schválené etapy přes comparisonCosts(). Jejich mezní částky se nesčítají; celý součet dává budget(). Platné skutečně koupené známky mají nulový nový výdaj, vypršelé vyžadují nový nákup. Úsekové/chorvatské mýto zůstává za každý průjezd. Koupená jednodenní AT známka se fiktivně neupgraduje na desetidenní.
- Náš rozpočet → Naše dálniční známky umožňuje záznam skutečného nákupu. Výběr trasy sám není nákup. Záznamy jsou v Settings.paidPasses; uložené nákupy nezmizí při odebrání trasy.
- React/TypeScript/Vite/MapLibre, Temporal, bez backendu/účtů. Zachovej explicitní MapLibre worker a klíč localStorage jedeme-spolu-v1. Nevymaž skutečný plán kvůli testu. Datový modul výletů se jmenuje excursionData.ts, aby nekolidoval s Excursions.tsx na Windows.

Při převzetí ověř Git status, větev, poslední commity a stav vůči aktuálnímu origin/main. Nepřepisuj cizí rozpracované změny. Není nutné znovu stahovat všechna geografická data ani měnit závislosti; potřebné runtime soubory jsou přibalené.

Spuštění na Windows: npm.cmd ci pouze při potřebě instalace; npm.cmd run dev pro vývoj. Produkční náhled: npm.cmd run build a npm.cmd run preview -- --port 4174. Před spuštěním zjisti, zda již server neběží. Port 4173 je galerie starých konceptů, nikoli aktuální aplikace.

Poslední funkční stav prošel 33 testy, produkčním buildem a lokálním runtime ověřením na 375/1280 px. To nenahrazuje ověření tvé nové změny. Při funkční úpravě spusť vhodné testy a build, skutečně zopakuj dotčený scénář v aplikaci a zaznamenej výsledek. Pouhá dokumentace nevyžaduje opakovat celou funkční sadu.

Git author musí odpovídat aktuální globální instrukci uživatelky (k 10. 9. 2026 zlatenkak@gmail.com; starší k.schmiedtova@seznam.cz Vercel od 9. 9. 2026 neuznává — ověř v CLAUDE.md, mohlo se změnit znovu). Hotovou ověřenou práci commitni a pushni přímo na main podle předchozí autorizace. Použij nastavené přihlášení, žádné tokeny v chatu/URL/kódu, .env ponech ignorovaný. Oprávnění sandboxu není totéž co znovu schvalovat zadání. Při práci ve worktree hlídej aktuální main. Nepoužívej any v TypeScriptu ani neobjednávej placené služby bez zadání. Jiným lidem nic neposílej bez výslovného pokynu.

Push na GitHub byl dokončen, Vercel projekt a veřejná produkční URL při předání nebyly doložené. Neoznamuj „nasazeno“ na základě localhostu. Pokud pokračuješ nasazením, nejprve zjisti skutečné propojení; při dostupnosti použij skill deploy, po deployi otevři veřejnou URL a otestuj hlavní akce včetně nového formuláře známek a produkčních hlaviček. Chybějící přístup či URL označ konkrétně, nehádej.

Průběžně aktualizuj relevantní dokumenty a context.md. Závěrem krátce napiš, co se změnilo, jak jsi to ověřil, kde je výsledek a co skutečně zůstává otevřené.
```

## NEJRYCHLEJŠÍ MOŽNÝ START PRO DALŠÍ SESSION

1. Otevřít kořen projektu nebo přiložené dokumenty; přečíst PROJECT_CONTEXT, CURRENT_STATE a DO_NOT_CHANGE.
2. Přečíst SESSION_SUMMARY, FILES_AND_MATERIALS a NEXT_STEPS; neimplementovat znovu hotové výlety/známky.
3. Ověřit `git status`, `git log` a větev main proti remote; zachovat případné novější změny.
4. Stručně shrnout pochopení a navrhnout konkrétní postup; pak vykonat autorizovaný úkol.
5. Zjistit, zda běží preview 4174; jinak spustit podle README. Port 4173 nepoužívat jako produkční aplikaci.
6. Před testovacími výběry zkontrolovat skutečný uživatelský plán/nákupy; nic plošně nemazat.
7. Upravit správný zdroj podle FILES_AND_MATERIALS, ověřit dotčené výpočty/UI a podle změny 375 px.
8. Zapsat výsledek, commit/push main; veřejné nasazení hlásit až po ověření skutečné produkční URL.
