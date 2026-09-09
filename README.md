# Jedeme spolu

Rodinný plán cesty Průhonice → Kamniška Bistrica → Bibinje → Průhonice, 12.–16. září 2026. Světlá mapa s malinovým akcentem podle schválené varianty A, denní itinerář pod mapou podle varianty C.

## Co aplikace umí

- 12 silničních variant ve třech etapách; všechny varianty etapy současně, barevné souběhy, kliknutí, zvýraznění a mapa celé dovolené.
- 17 míst a 49 přiřazení zastávek k trasám. Příjezdy a zajížďky vypočtené po silnici, sdílená místa mají samostatné údaje pro každý koridor.
- Prohlížení trasy samo nezmění uložený plán. Tlačítko pro použití trasy nebo přidání zastávky je výslovná volba uživatele.
- Odjezdy, délky pauz, vlastní rezerva, odebrání zastávky, přepočet ETA a datum při přechodu přes půlnoc v Europe/Prague.
- Editovatelná spotřeba a společná cena benzínu, rozpočet jednotlivé etapy i celé dovolené, známky bez duplicit za období platnosti. Zohledněné rozdělení mýta HAC při sjezdech Ogulin a Vrata/Fužine.
- Rozpis silnic, charakteru zatáček, výhod a nevýhod; data a odkazy s datem ověření. Plán se ukládá v localStorage tohoto prohlížeče.

## Spuštění ve Windows

Je potřeba Node.js 24 LTS a npm. V PowerShellu otevřeném v tomto adresáři:

```powershell
npm.cmd ci
npm.cmd run dev
```

Otevřete adresu vypsanou v terminálu, obvykle `http://127.0.0.1:5173/`. Ta funguje na tomto počítači. Pro otevření na Androidu potřebujete nasazený web nebo přístup k vývojovému serveru v místní síti.

Hotové sestavení a jeho místní kontrola:

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview -- --port 4174
```

Přístupové klíče ani `.env` nejsou potřeba. Všechny routy a zastávky už jsou přibalené; jejich stahování se při běžném otevření aplikace neopakuje.

## Technologie a struktura

React 19, striktní TypeScript 7, Vite 8, MapLibre GL JS 6, Temporal polyfill, Vitest. MapLibre se načítá samostatně a používá Vite `?worker&url`, aby GeoJSON fungoval i v produkčním buildu. Mapové dlaždice poskytuje OpenStreetMap; připojení k internetu je potřeba. Není slíbena offline mapa ani offline první načtení.

- `src/App.tsx`: rozhraní, denní plán, detaily a zdroje.
- `src/MapView.tsx`: mapa, trasy a markery.
- `src/planning.ts`: časy, benzín, platnosti a rozpočet; `src/planning.test.ts`: testy.
- `data/routes.mjs`: koridory, etapy, poplatky a slovní hodnocení.
- `data/places.mjs`: popisy, vybavení, provoz a délky pobytu zastávek.
- `data/sources.mjs`: zdroje a data ověření; `data/toll-adjustments.mjs`: změny HAC mýta při zastávkách.
- `public/data/trip.json`: hotový datový balík. `public/data/*.geojson`: samostatné geometrie tras.
- `data/crosschecks.json`: kontrolní výpočty OSRM se stejnými body pro A, B a D první etapy.
- `concepts/`: původní tři návrhy vzhledu. Nejsou cestovními daty ani produkční aplikací.
- `context.md`: potvrzené požadavky, rozhodnutí a stav práce.

## Aktualizace dat

Při změně geometrie nebo průjezdních bodů upravte `scripts/acquire-valhalla.mjs`. Sada bodů pro C má dvě části; jižní část výslovně vylučuje dálnice a mýto. Všechny ostatní průjezdní body jsou `through`, aby nevznikaly otočky na dálnici.

```powershell
npm.cmd run data:routes
node scripts/crosscheck-routes.mjs
```

Skripty používají Nominatim a veřejný Valhalla endpoint pouze při přípravě dat. Požadavky běží postupně s pauzou a ukládají se do ignorovaných složek `research/`. Při změně URL se cache obnoví. Pro obnovení stejných dotazů po čase odstraňte konkrétní příslušné cache soubory. Po změně zastávek nebo jejich geokódování použijte `npm.cmd run data:stops`. Při čerstvém klonu nejdříve spusťte `data:routes`, aby existovaly podklady pro odbočky.

Ověřte správné výsledky geokódování (centrum jezera není příjezd autem), navigační pokyny, mýtnice, povrch a případné otočky. Změna geokódování může vyžadovat opravu výběru výsledku ve `scripts/acquire-stops.mjs`. Body nejsou zárukou volného ani veřejného parkovacího místa. Poté spusťte testy a vizuálně projděte trasy. Data se do aplikace dostávají až po `scripts/build-data.mjs`; nezapisujte ceny či geometrie do komponent.

Při aktualizaci cen upravte částky v `data/routes.mjs`, `data/toll-adjustments.mjs` a pravidla známek v `src/planning.ts`, včetně testů. Výchozí cena paliva je v `defaults()` a vysvětlení v nastavení aplikace; aktualizujte oboje i odpovídající zdroj v `data/sources.mjs`. Neměňte jen datum bez nové kontroly zdroje. Po změně metadat spusťte `node scripts/build-data.mjs` s dostupnou cache.

## Metodika a praktická omezení

- Jízdní časy Valhalla nemají živou dopravu, fronty ani aktuální uzavírky. OSRM při stejných bodech vrací u A přibližně o 28 min méně, u B o 6 min a u D o 18 min méně; délky se liší pod 0,2 km. Všechny výpočty aplikace používají jednotně Valhallu.
- Dálniční kilometry jsou aproximace ze skupin navigačních pokynů s příznakem `highway`. Tento příznak není klasifikací každého metru. Časy k hranicím jsou interpolace podél geometrie; platnosti se počítají z místních dat průjezdu, rezerva se pro konec průjezdu uplatní konzervativně.
- Zajížďka nahrazuje základní úsek mezi kotvami cca 12 km před a za nejbližším bodem na trase. Příjezd k místu má samostatný routingový čas. Kladný rozdíl se přičte; případná drobná úspora proti základnímu úseku se konzervativně neodečítá. Překrývající se zajížďky nelze přidat současně. Pobyt zahrnuje chůzi a hledání parkování; doporučené doby jsou odhady.
- Rodinné rozmezí je samostatný odhad: 20–35 min pauzy po zhruba 2 h jízdy a až 30 min rezervy. Aktuální itinerář zahrnuje jen výslovně přidané pauzy a rezervu. Tipy nenahrazují pravidelné zastavení podle únavy.
- Časové známky: AT 1denní/10denní a SI týdenní; pro pevné termíny této dovolené to pokrývá potřebná období. Aplikace není univerzální optimalizátor měsíčních/ročních známek pro libovolně dlouhé pobyty. SI začátek + 6 dní, AT desetidenní začátek + 9 dní. CZ již zakoupená má nový výdaj 0 €.
- Mýto platí pro osobní Superb bez přívěsu, SI 2A, HR I. Jídlo, parkování a vstupné nejsou součástí cestovního rozpočtu. Neznámé údaje jsou viditelně označené.
- **Bibinje — změna 9. 9. 2026:** uživatelka zadala novou výslednou adresu Branimirova obala 12. Booking ji uvádí u Apartman More, Travelmyth uvádí GPS 44.078068, 15.276598. Použit bod této nabídky, nikoli střed ulice z Nominatim ani sousední nabídka na čísle 12a. Konkrétní vjezd/parkování potvrdit s hostitelem. Adresa a bod jsou v `data/destination.mjs`; přepočítané všechny hr-* a home-* varianty.
- **Slovinské ubytování:** posledních cca 500 m k zadanému GPS má příznak horšího povrchu. Zkontrolovat přesný přístup s ubytovatelem.
- **Ljubelj:** uložená jižní geometrie nemá dálnici ani mýto. To není potvrzení průjezdnosti v budoucím konkrétním čase. Tscheppaschlucht byla prověřena a není vydávána za krátkou pauzu.
- Context7 v relaci nebyl dostupný. Použitá aktuální oficiální dokumentace React, Vite, MapLibre, Valhalla a OSRM. MapLibre instalační postup: https://maplibre.org/maplibre-gl-js/docs/.

## Vercel

Projekt je statická klientská aplikace. `vercel.json` nastavuje build `npm run build`, výstup `dist` a bezpečnostní hlavičky. Nejsou potřeba databáze, účet v aplikaci, API klíče ani serverové endpointy. RLS, CORS a rate limiting zápisových API se zde neuplatňují, protože aplikace žádná nemá. Vstupy pro lokální výpočet a obnovený plán jsou validované, uživatelský text vykresluje React s escapováním.

Po propojení GitHub repozitáře s Vercel nastavte framework Vite a produkční větev `main`. Autorem commitů musí být `k.schmiedtova@seznam.cz`. `.env` je v `.gitignore`. Po každém nasazení otestujte na skutečné veřejné URL mapové čáry, marker, přidání a odebrání pauzy, změnu odjezdu, benzín, další etapy a telefon 375 px.

V této pracovní složce při zahájení nebyl nastavený vzdálený repozitář ani propojení s Vercel. Připravené sestavení samo o sobě neznamená zveřejnění webu.

## WC a benzín — 9. 9. 2026

- 100 míst, z toho 60 s doloženými WC a 57 s benzinovým palivem, 203 přiřazení ke směrům všech 12 tras. Kategorie se překrývají.
- Samostatná vrstva: oba filtry výchozí zapnuté, kliknutí do detailu, seznam dostupný i bez mapy, blízké značky se při oddálení seskupují. Původní výletní zastávky a uložený itinerář zůstávají samostatné.
- Zdroj: OpenStreetMap přes veřejné Overpass API. Zobrazuje se datum stažení, přístup k WC, poplatek a otevírací doba, pokud jsou v datech. Benzín vyžaduje výslovný údaj fuel:octane_95/98/100, gasoline_95 nebo e10; samotné amenity=fuel nestačí. WC není automaticky předpokládáno u pumpy. Vyloučeny záznamy se zakázaným/soukromým přístupem a zrušené objekty.
- Kandidáti do 450 m od geometrie, výběr pro obě služby v přibližně 65km úsecích. Nejde o úplný seznam provozoven ani slib nepřetržité dostupnosti. Příjezd se kontroluje Valhallou s orientovanými body 3 km před/za místem; přijaty zajížďky do 5 km / 10 min a konec příjezdové geometrie do 90 m od bodu. 36 nevhodných kandidátů odmítnuto. Není garantováno aktuální otevření nebo obsazenost.
- Značky nemění rozpočet ani itinerář: pauzu i případnou zajížďku zohlední uživatel ve vlastní rezervě. WC stanice nemusí sdílet její otevírací dobu.
- Data připravuje `npm.cmd run data:services`; předpokládá routingové cache z `npm.cmd run data:routes`. Stažené oblasti a dotazy se cachují v ignorovaném research/services/. Při obnově dat záměrně odstraňte odpovídající cache. data/services.json je veřejný výřez dat OSM pod ODbL, © OpenStreetMap contributors; atribuce a jednotlivé zdroje také v aplikaci. Obnova může být pomalá kvůli veřejným serverům, běh aplikace na nich nezávisí.
- Veřejné evropské Overpass servery při přípravě vracely chyby nebo timeout. Úspěšně použit veřejný server maps.mail.ru/osm/tools/overpass, uvedený v oficiálním seznamu instancí OSM; dotazy obsahují pouze geografické oblasti a typy zařízení, žádné přihlašovací údaje.
