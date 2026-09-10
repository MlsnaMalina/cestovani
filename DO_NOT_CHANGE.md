# DO_NOT_CHANGE — mantinely pokračování

Stav 10. 9. 2026. Tento soubor chrání přijatá rozhodnutí, nikoli každý znak implementace. Cílené opravy, aktualizace doložených údajů a běžné úpravy v autorizovaném rozsahu jsou možné; nesmějí potichu změnit význam aplikace. Novější výslovné zadání uživatelky má přednost.

## Výslovně schválené a závazné

### Účel a cestovní plán

- Rodina rozhoduje sama. Nevybírat vítěznou trasu, nedávat předvolenou „nejlepší“ cestu a nezaměnit otevření detailu za schválení.
- **Design A + C není schválení cestovního koridoru A.** Písmena tras a návrhů jsou různé věci.
- Zachovat tři etapy, termíny 12., 13. a 16. 9. **2026**, časové pásmo Europe/Prague a upravitelné odjezdy 04:00/11:00/10:00.
- Slovinsko: Kamniška Bistrica 8, 1242 Stahovica, GPS 46.32924, 14.585544.
- Chorvatsko: **Branimirova obala 12, 23205 Bibinje**, katalogový bod Apartman More. Nevracet Ulica Braće Radića 63, nezaměnit 12 za 12a a nepoužít střed ulice bez ověření.
- Check-in od 14:00 není nejpozdější příjezd. Nevynucovat ETA 14:00 ani nevymýšlet nejpozdější návrat do Průhonic.
- Škoda Superb, dva dospělí a dítě 5 let; poznámky o zatáčkách a pravidelných pauzách ponechat jako praktické hodnocení, nikoli zdravotní garanci.

### Vzhled, názvy a tón

- Název **Jedeme spolu**, hlavní formulace „Nejdřív hory. Potom moře.“, „Náš rozpočet“, „Použít pro tento den“, „Zdroje a aktuálnost dat“ a rozpoznatelné názvy etap zachovat. Tyto texty jsou součástí existujícího rozhraní; přejmenování bez uživatelského důvodu není potřebnou opravou.
- Zachovat schválenou dominantní mapu A a denní informace C pod mapou. Na mobilu nesunout srovnávací seznam před denní itinerář.
- Bílé pozadí, malinový akcent `#b72150`, tmavý text `#192d31`; Segoe UI / Trebuchet MS podle současného CSS. Barvy jednotlivých tras zůstávají konzistentní mezi kartou, legendou a mapou.
- Žádná béžová, tmavý technický redesign, fialovomodrý gradient, šablonový úvod se třemi kartami nebo náhodné barevné pruhy.
- Čeština, správná diakritika, srozumitelný osobní tón, datum `d. m. yyyy`. V JS/TS/JSON hlídat oddělovače řetězců; české uvozovky nesmějí rozbít syntaxi.

### Chování mapy a míst

- Všechny varianty zvolené etapy současně; možnost celé dovolené zůstává. Nezredukovat ověřené varianty z 12 zpět na původní tři jen podle úvodního zadání.
- **WC a Benzín při načtení vypnuté**, ručně a nezávisle zapínatelné, reload oba vypne. Neodvozovat WC automaticky z existence pumpy.
- Služby mají vazby ke konkrétním směrům, ne pouze vzdálenost vzdušnou čarou. Samy nepřidávají pauzu, zajížďku nebo výdaj do itineráře.
- Výletní sluníčka, skupiny blízkých bodů, fotografie a podrobné dialogy zachovat. Limit hodiny znamená vypočtený silniční příjezd i návrat, chůze/lanovka navíc. Neslibovat hodinu v živém provozu.
- Ljubljana není přijatý hodinový výlet; Paklenica má upozornění na placenou dálnici. Velika planina je příjezd k nástupu, ne autem k horským domkům.
- Místní výlety automaticky nemění přejezdový itinerář ani společný rozpočet. Jejich benzín se počítá zvlášť tam i zpět.
- Fotografie musí odpovídat místu nebo být výslovně označené jako ilustrační. Zachovat autora/licenci/zdroj; neodstranit kredity ani zaměnit snímek bez aktualizace manifestu.

### Ceny a zaplacené známky

- Všechny ceny zobrazovat v Kč i EUR. Výpočetní měna EUR, nezaokrouhlovat mezivýpočty. Kurz uživatele má přednost před výchozím snímkem ČNB a přežije reload.
- CZ známka má nulový nový výdaj. Zahraniční platná známka se neopakuje za každou etapu.
- Schválená trasa není uskutečněný nákup. `paidPasses` je záznam skutečného nákupu zadaný uživatelem, ne automatický vedlejší efekt výběru cesty.
- Platnost řešit podle průjezdu zemí v místním čase, včetně koncového dne a přes půlnoc; ne pouze podle startu dovolené.
- Již zaplacenou AT1 nepovažovat za vratnou/vyměnitelnou. Doplatek plánované AT1 → AT10 se týká pouze dosud nekoupeného plánu.
- Úsekové a chorvatské mýto se platí za průjezdy, platná časová známka ho neodpouští. Zachovat úpravy sjezdů Ogulin/Fužine.
- Karty používají `comparisonCosts()` a význam „navíc k ostatním etapám“. Nesčítat mezní ceny etap do celku. Celkový rozpočet počítá `budget()` a skutečné nákupy pouze jednou.
- Zapsaná koupená známka zůstává nákladem i po změně/odebrání trasy. Odebrání jejího místního záznamu není vrácení peněz u prodejce.
- Jídlo, vstupné, parkování a místní výlety zatím nejsou součástí společného přejezdového rozpočtu; nezahrnout je potichu.

## Technické mantinely proti regresím

- Zachovat React/TypeScript/Vite/MapLibre a přibalené geometrie. Bez důvodu nepřidávat runtime routingové API, server, databázi ani účty.
- Explicitní MapLibre worker pro produkční build je oprava reálné chyby. Neodstraňovat jej při úklidu importů.
- Souřadnice `Point` jsou `[lon, lat]`. Opačné pořadí je například v textovém GPS popisu; neprohodit ho v geometrii.
- Zachovat `jedeme-spolu-v1`, existující ID a validovanou migraci `restore()`. Při změně schématu zachovat původní plány a záznamy.
- Na Windows nevracet kolidující dvojici `excursions.ts` / `Excursions.tsx`; datový modul je `excursionData.ts`.
- Striktní typy bez `any`, žádné tajné klíče do kódu/Gitu. `.env` ignorovaný. Žádné tokeny v URL nebo chatu. Bez nových serverových API zde není databázové RLS co nastavovat.
- Zdrojová data a odvozené trip/GeoJSON musí zůstat konzistentní. Nevyměňovat ověřená čísla za staré odhady 580/640/680 km.
- Oprava není hotová pouze po buildu: zopakovat skutečný dotčený scénář. Po deployi testovat skutečnou veřejnou URL, po UI změně také 375 px. Neslibovat fyzický Android test, pokud šlo jen o emulaci.
- Hotové ověřené změny commit/push na `main`, autor `k.schmiedtova@seznam.cz`. Ve worktree nejdříve zkontrolovat stav vůči main. Cizí změny nepřepisovat.

## Vyžaduje potvrzení před změnou

- Jiné adresy, termíny, cestující nebo skutečně potvrzené nákupy; výjimkou jsou uživatelem nově výslovně zadané opravy.
- Zásadní redesign, nový název nebo jiné řazení hlavních částí. Pro nové UI platí uživatelčin postup s návrhovými směry; pro drobné opravy A + C znovu volbu nežádat.
- Automatický výběr trasy, změna významu rozpočtu, přidávání výletů/služeb do cen bez výslovné volby.
- Účty, synchronizace, placené API/služby, sběr registrační značky, analytika nebo jiná nová osobní data. Nic z toho není potřeba pro současný rozsah.
- Výrazné přepsání architektury nebo závislostí, které nemá oporu v řešeném problému. Běžná cílená oprava není tímto blokovaná.

## Co lze aktualizovat bez nové designové volby

Ověřené ceny a provozní údaje se zdrojem/datem, cílené opravy funkční chyby, přístupnost formuláře, oprava rozbitého odkazu a průběžná dokumentace. Vždy zachovat výše uvedenou sémantiku a nesmazat uživatelčina data. Pokud není jisté, zda jde o změnu požadavku, nejprve popsat konkrétní dopad a položit jedinou potřebnou otázku.
