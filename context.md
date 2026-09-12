# Mapa dovolené — rozhodnutí a stav

Aktualizováno: 10. 9. 2026. Jazyk: čeština. Časová zóna: Europe/Prague.

**Předání projektu:** začněte [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) a [CURRENT_STATE.md](CURRENT_STATE.md). Tento soubor je chronologický deník; starší nehotové stavy jsou překonané pozdějšími záznamy. Připravený prompt: [PROMPT_FOR_NEXT_MODEL.md](PROMPT_FOR_NEXT_MODEL.md).

## Potvrzené zadání

- Interaktivní mapa pro vlastní rozhodování rodiny. Aplikace nesmí vybrat vítěznou trasu ani automaticky prosazovat nejrychlejší variantu.
- Škoda Superb, česká dálniční známka již zakoupena. Další známky lze koupit podle zvolené cesty.
- Dva dospělí a pětileté dítě v protisměrné autosedačce. Kinetóza je důležitý parametr, ale ne automatické vyřazovací kritérium.
- 12. 9. 2026: Průhonice → Kamniška Bistrica 8, 1242 Stahovica, Slovinsko, 46.32924, 14.585544. Odjezd v noci/nad ránem, výchozí upravitelný čas 04:00. Ubytování od 14:00. Zahrnout možnost výletu poblíž cíle před ubytováním.
- 13. 9. 2026: odjezd z Kamniške Bistrice přibližně 11:00 → Branimirova obala 12, 23205 Bibinje (nová adresa potvrzená uživatelkou 9. 9.). Ubytování od 14:00. Hledat oběd na trase. Čas 14:00 není potvrzený požadovaný čas příjezdu.
- 16. 9. 2026: odjezd z Bibinje v 10:00 → Průhonice. Požadovaný nejpozdější příjezd není stanoven.
- První etapa obsahuje povinně koridory přes Linec/Graz, Vídeň/Graz a Linec/Korutany/Ljubelj. Pro další etapy teprve ověřit smysluplné alternativy, ne mechanicky kopírovat první tři trasy.
- Všechny ověřené varianty právě prohlížené etapy zobrazit současně. Souhrnná mapa celé dovolené navíc.
- Kliknutí na trasu zobrazí cenu, čas, vzdálenosti, charakter silnic, zastávky, plusy, mínusy a zdroje. Aktivace detailu není výběrem doporučeného vítěze.
- React, TypeScript, Vite a pravděpodobně MapLibre; lokální ověřené GeoJSON, bez kritické runtime závislosti na demo routingu.
- Před produkční implementací ukázat tři skutečně odlišné HTML koncepty a vyčkat výběru vzhledu. Skill: C:/Users/merit/.agents/skills/design-directions/SKILL.md.

## Pracovní předpoklady (nepotvrzené)

- Běžný osobní Superb do 3,5 t bez přívěsu; benzín podle původního zadání, editovatelná spotřeba 8 l/100 km.
- Termíny pobytů jsou pevné, časy odjezdu editovatelné. Check-in je nejdřívější možné ubytování, není slibem ETA.
- „Všechny vhodné varianty“ znamená odlišné smysluplné silniční koridory, ne všechny kombinace místních ulic. Evidovat i důvody vyřazení skutečně nevhodných tras; při nejistotě nezatajit alternativu.
- Bez účtů; plán a vlastní nastavení uložit v daném prohlížeči. Sdílení/synchronizace mezi telefony není zatím požadována.
- Uložený itinerář a lokální data mohou fungovat bez sítě; dostupnost podkladové mapy offline vyžaduje samostatné technické ověření a není slíbená.
- Žádná live dopravní prognóza. Routingový čas, pauzy, zajížďky a rezerva musí být rozlišeny.

## Rozpočet celé dovolené

- Českou již zakoupenou známku neúčtovat jako nový výdaj.
- Časovou známku účtovat jednou za platné období, nikoli při každé etapě či opakovaném průjezdu.
- Rozlišit cenu samostatné etapy, nový výdaj při jejím přidání a cenu celého zvoleného plánu.
- Úsekové mýto a chorvatské mýto účtovat za skutečné průjezdy.
- Vyhnutí se slovinské dálnici v první etapě nemusí šetřit cenu známky, pokud ji rodina potřebuje pro následující přesuny.
- Bez ověřené geometrie nepřiřazovat poplatky konkrétní trase jako definitivní.

## První ověření zdrojů — 8. 9. 2026

| Údaj | Zjištění | Zdroj |
|---|---|---|
| Rakouská desetidenní známka, osobní auto | 12,80 EUR, 10 po sobě jdoucích kalendářních dní. Při začátku 12. 9. platí do 21. 9. včetně (výpočet z pravidla). | https://bmp.asfinag.at/vignette-und-streckenmaut/vignette/ a https://shop.asfinag.at/en/products/digital-vignette/10-day-vignette/ |
| Slovinská týdenní známka 2A | 16 EUR. Platí počáteční den + 6 následujících dní, tj. při začátku 12. 9. až do 18. 9. včetně. DARS definuje 2A pro běžná osobní vozidla dle hmotnosti a výšky nad přední nápravou. Přesné přiřazení modelu ještě doložit. | https://evinjeta.dars.si/en a https://evinjeta.dars.si/en/e-vignette-validity |
| A9 Bosruck | 7 EUR za jednotlivý průjezd pro vozidla do 3,5 t; sazba 2026. | https://www.asfinag.at/en/toll/section-toll/ |
| A9 Gleinalm | 12 EUR za jednotlivý průjezd; sazba 2026. | https://www.asfinag.at/en/toll/section-toll/ |
| Chorvatské mýto | HAC vybírá podle vjezdu, výjezdu a kategorie vozidla. Cenu teprve ověřit pro konkrétní koridory a datum; jiné provozovatele řešit zvlášť. | https://www.hac.hr/en/toll |
| Výlet u první adresy | Pramen Kamniške Bistrice a soutěsky Predaselj jsou doložené oficiálním Visit Kamnik. Zatím kandidáti; bez ověřeného parkování, délky dětské procházky a provozních podmínek. | https://www.visitkamnik.com/en/top-attractions/the-valley-of-kamniska-bistrica-river |

Historický stav před implementací: geometrie a cestovní výpočty v této fázi ještě chyběly; aktuální stav je uveden níže. Koncepty mají výslovně schematickou mapu a žádné vymyšlené číselné cestovní údaje.

## Tři koncepty rozhraní

1. Mapa naplno: bílé plochy, malinový akcent, Trebuchet MS / Segoe UI, mapa jako hlavní pracovní plocha a detail ve spodním panelu. Dobrá shoda se zadáním. Proti: cena celé dovolené je schovaná o jednu úroveň hlouběji.
2. Cestovní atlas: bílá, petrolejová, výrazná černá sazba; Georgia / Arial; mapa a redakčně sázený přehled. Proti: více čtení a menší prostor pro mapu na telefonu.
3. Den po dni: bílá, terakota, modrá; Bahnschrift / Segoe UI; denní časová osa propojená s mapou. Proti: organizace podle dnů může odvádět pozornost od přímého srovnání tras.

Uživatelka vybrala kombinaci A + C: vzhled a dominantní mapa konceptu 1 (Mapa naplno), pod mapou informace a denní časová osa z konceptu 3 (Den po dni). Platí pro desktop i mobil. Tento výběr autorizuje produkční implementaci; další potvrzení vzhledu se nevyžaduje. Žádná cestovní trasa tím nebyla vybrána.

## Checklist

- [x] Přečíst zadání a položit tři otázky.
- [x] Zapracovat odpovědi a rozšířit rozsah na tři přesuny.
- [x] Zahájit ověření poplatků a zaznamenat první oficiální zdroje.
- [x] Připravit a zkontrolovat tři koncepty na desktopu a při 375 px.
- [x] Získat výběr vzhledu před produkčním kódem: A + denní plán C pod mapou.
- [x] Ověřit silniční koridory všech etap, geometrie, vzdálenosti, časy, klasifikace silnic a průjezdy mýtem.
- [x] Ověřit bezdálniční geometrii Ljubelj–Kamnik. Budoucí průjezdnost nepotvrzena; výslovně uvedená nejistota a odkaz na aktuální provoz.
- [x] Prověřit zastávky, výlet před check-inem a nedělní oběd včetně reálných příjezdů.
- [x] Dokončit finanční zdroje, platnosti známek a rozpočet celé dovolené bez duplicit.
- [x] Navrhnout datový model pro etapy, alternativy, sdílená místa a zdroje.
- [x] Implementovat mapu, detaily, srovnání, itinerář a přepočty.
- [x] Jednotkové testy výpočtů, půlnoci, Europe/Prague a platností poplatků.
- [x] Ověřit původní scénáře v běžící aplikaci včetně 375 px, mapy, konzole a všech interakcí.
- [x] README, finální přehled ověřených údajů a odhadů.
- [x] Push a nasazení: GitHub propojen, `/deploy` proveden, živá URL otestována — viz záznam 10. 9. 2026 níže.

## Prostředí

- Při zahájení prázdný repozitář, větev master bez commitů a bez remote. Nyní je implementována aplikace React/TypeScript/Vite/MapLibre.
- Context7 nebyl dostupný; aktuální dokumentace byla ověřena přes oficiální weby a verze přes npm registry.

## Koncepty — ověření

- Tři samostatné HTML náhledy v concepts/, souhrn concepts/prehled.html.
- Náhledy spustí `node concepts/serve.mjs`, URL http://127.0.0.1:4173/prehled.html. Pouze místní náhled, na telefonu není localhost tohoto počítače přímo dostupný.
- Prohlédnuto v Codex browseru na desktopu 1280 px a v mobilním viewportu 375 × 812. Bez vodorovného přetečení; obsah 360 px kvůli rezervě scrollbaru desktopového prohlížeče.
- Ověřeno otevření detailu, přepnutí do druhé etapy a skrytí sobotního itineráře; opraveno překrývání popisků mobilní mapy. Bez zachycených chyb JavaScript konzole při kontrole konceptů.
- Sebehodnocení konceptů (subjektivní, ne výsledek uživatelského testu): 1 originalita 8/10, shoda 9/10; 2 originalita 8/10, shoda 8/10; 3 originalita 8/10, shoda 8/10.
- Vzhled byl vybrán: A + informace C pod mapou. Produkční implementace dokončena; aktuální výsledek níže.

## Hotová aplikace — 9. 9. 2026

- Schválené rozhraní A + C: dominantní mapa a denní itinerář bezprostředně pod mapou také při 375 px. Na desktopu srovnání vedle mapy, na mobilu za itinerářem.
- 12 skutečných silničních geometrií: 6 do Slovinska (včetně dvou variant delší jízdy po dálnici a Salcburku), 3 k moři, 3 domů. Uloženo lokálně v public/data. Žádná automaticky vítězná trasa.
- 17 zastávek, 49 vazeb na konkrétní trasy. Silniční příjezdy/zajížďky Valhalla; sdílené místo má vlastní čas a vzdálenost pro každý směr. OSRM nezávisle porovnává tři koridory první etapy.
- Branimirova obala 12 doložena Bookingem; GPS ubytování Apartman More [15.276598,44.078068] z Travelmyth. Nominatim vrátil pouze střed ulice, proto nebyl použit jako číslo domu. Číslo 12a je jiné. Jediný zdroj cíle data/destination.mjs. Všech 6 dotčených tras i zastávky přepočteny. Navigační silnice končí cca 47 m od katalogového bodu; konkrétní vjezd/parkování potvrdit s hostitelem.
- Příjezdy: Zagreb 444,762 km / 284,067 min; Rijeka 449,326 / 319,799; Metlika 381,434 / 289,057. Návraty: Linec 905,828 / 596,093; Vídeň 960,531 / 591,091; Salcburk 1070,165 / 676,840. Bez živé dopravy.
- Rodinné pauzy jsou orientační interval, konkrétní itinerář sčítá vybrané zastávky, zajížďky a rezervu. Pobyt i odjezd editovatelné. Přechod přes půlnoc a letní čas řeší Temporal Europe/Prague.
- Benzín výchozí 8 l/100 km × 1,912 €/l (WKO k 7. 9., ověřeno 8. 9.); oba vstupy editovatelné. Cena samostatné etapy, nový výdaj při přidání/nahrazení, součet celé cesty. AT/SI známky sdílené dle platnosti a přibližných časů průjezdu státem.
- HAC ceny dle skutečných mýtnic, včetně sjezdu Ogulin a Vrata/Fužine (úpravy podle tabulek HAC). Metlika vstupuje na A1 Novigrad. Žádné jídlo, parkování ani vstupné v součtu benzínu/mýta.
- Veřejné zdroje a datum ověření přímo v aplikaci. Neověřené vybavení, ceny či otevírací doby označeny větou „Aktuální údaj se nepodařilo spolehlivě ověřit.“ Budoucí uzavírky negarantovány. Tscheppaschlucht není nabízena jako krátká pauza (dlouhá chůze a schody).
- localStorage pouze v aktuálním prohlížeči, bez synchronizace/účtů. Podkladová mapa potřebuje internet. Není slíbena plná offline aplikace.
- MapLibre používá explicitní ESM worker z Vite; bez něj se nezobrazovaly trasy. Oprava ověřena skutečným kliknutím na barevnou geometrii. Automatické přizpůsobení při změně rozměrů.

## Ověření hotové aplikace

- npm run build úspěšný. 14 jednotkových testů: palivo, mýto, známky bez duplicit a jejich platnost, hranice/půlnoc/DST, příjezdy a změny zastávek, obnova poškozených dat, všech 12 tras a 6 nových cílových bodů.
- V běžícím produkčním sestavení na portu 4174 ověřeny všechny varianty, kliknutí do mapy, sdílená zastávka v celé dovolené i opačném směru, přidání/změna/odebrání zastávky, odjezdy, rozpočet, palivo a neplatné hodnoty.
- Konkrétní scénář: 13. 9. přes Záhřeb, Čad 75 minut, odjezd 11:00 → 17:25. Čad 60 minut a odjezd 11:30 → 17:40. Karta zastávky ukazuje upravených 60 minut. Změna spotřeby 10 a ceny 2 přepočítala základní benzín na 88,95 €.
- Mobil 375 × 812 a desktop 1280 × 900 zkontrolovány v prohlížeči. Na mobilu bez vodorovného přetečení, mapa 390 px a itinerář hned pod legendou. Kontrola v emulované šířce, nikoliv na fyzickém Androidu.
- Připraven README a vercel.json (bez tajných klíčů). Vercel hlavičky se v lokálním preview nepoužívají; ověření živého nasazení zbývá až po připojení služby.
- Místní hotový náhled http://127.0.0.1:4174/. Starý port 4173 obsahuje pouze designové koncepty. Vývojový server běží na 5173.
- Po posledních opravách znovu ověřeno uložení času 11:30, pobytu 60 minut a příjezdu 17:40 po obnovení stránky. Neplatný číselný vstup má stabilní přístupný název a chybu. Zkušební výběry odstraněny, odjezdy a palivo vráceny na výchozí hodnoty. Poslední kontrola konzole bez nových chyb. Lokální větev main; push/nasazení nelze dokončit bez remote.

## Rozšíření WC / benzín a GitHub — 9. 9. 2026

- Uživatelka požádala o značky pro toalety a tankování, při zachování schváleného vzhledu A + C. Jde o doplnění současné mapy; další volba vzhledu nebyla potřeba.
- Doplněno 100 míst / 203 vazeb ke konkrétním trasám. WC má 60 míst, benzín 57; některé obě služby. Podrobnosti, omezení zdrojů a reprodukce jsou v README.
- Filtry WC / Benzín, sdružené značky při oddálení, seznam i detail, odkazy na zdroj a mapu. Zdrojové záznamy nejsou telefonicky ověřené, žádná automatická domněnka WC u každé pumpy. Pauzy se samy nepřidávají do itineráře.
- Rozšířená kontrola: 16 testů včetně dostupnosti obou služeb pro každou trasu, nezávislých filtrů, směrů, bez duplicit a limitů zajížďky. V prohlížeči ověřen detail MOL/Shell, přepínače WC/benzín a nulový stav, seznam skupiny.
- Uživatelka výslovně zadala nahrání výsledku do https://github.com/MlsnaMalina/cestovani.git, větev main podle globálních pravidel. Přístup čtením ověřen, vzdálený repozitář byl prázdný. Starší poznámky o chybějícím GitHubu tímto překonány. Vercel dosud není připojen.
- Finální ověření v produkčním lokálním náhledu: všech 12 variant má správný počet míst (12–28 podle trasy), seskupené značky fungují, filtry nevypínají samotnou mapu, seznam a detail se otevírají. Mobil 375 px bez vodorovného přetečení, ovládání pod mapou a itinerář pod ním. Finální sestavení a všech 16 testů prošlo; konzole bez chyb. Připraveno k push na uživatelkou zadaný GitHub.

## Koruny, eura a fotografie — 9.–10. 9. 2026

- Navazuje na push 55876b8 na main v GitHubu. Uživatelka chce všechny ceny v obou měnách a obrázky u výletních zastávek; vzhled A + C zůstává schválený.
- Doplněn společný Money/CurrencyText pro ceny tras, palivo, známky, mýto, rozdíly, rozpočet i vstupné a cenové poznámky zdrojů. Kurz ČNB 24,25 Kč/EUR k 9. 9. 2026 ověřen oficiálním API, editovatelný v nastavení včetně návratu na výchozí údaj. Jde o datový snímek, nikoli automatický bankovní kurz. Původní uložené plány zůstávají funkční.
- 17 přibalených fotografií Commons, náhledy na kartách a celý snímek v detailu včetně autora a licence. Čad má označené ilustrační jídlo. Výběr a licence v data/photos.json a public/photos/CREDITS.md. Všechny snímky vizuálně zkontrolovány; historické fotografie nejsou příslibem aktuálního vzhledu.
- V běžícím produkčním náhledu ověřeno: kurz 25 → benzín 47,80 Kč / 1,912 EUR za litr, uchování kurzu po obnovení, odmítnutí nuly, obnova ČNB; Laxenburg 4,50 EUR / 109,13 Kč, celá etapa B 130,87 EUR / 3 173,69 Kč, rozpis známek a nulové mýto v obou měnách. Zkušební výběr trasy odstraněn a kurz vrácen na ČNB.
- Mobilní viewport ověřen DOM měřením innerWidth 375, clientWidth i scrollWidth 360 (15 px zabírá scrollbar): bez vodorovného přetečení. Fotky načtené, karty i detail čitelné. Vercel není připojen; dokončení znamená GitHub a místní náhled, nikoli živé nasazení.
- Závěrečná kontrola: sestavení úspěšné, všech 21 testů prošlo (včetně kurzů, obnovy starého plánu a přibalených JPEG), desktop 1280 px a mobil 375 px ověřeny, konzole bez chyb. Kontrola diffu a ignorování .env bez nálezu tajných klíčů.
- 10. 9. 2026: Na přání uživatelky jsou WC a Benzín při načtení stránky vypnuté. Zapnutí je ruční a nezávislé; obnovení stránky opět vypne oba filtry. Produkční sestavení prošlo. V prohlížeči ověřeno 0 míst → WC 28 → obě služby 42 → po obnovení 0, také mobilní šířka 375 px.


## Výlety od ubytování a ceny podle schváleného plánu — 10. 9. 2026

- Navazuje na main dc2b5ba. Oba požadavky dokončeny společně; uživatelka nadále rozhoduje o trasách sama. Zachován schválený vzhled A + C.
- 11 výletů (5 SI, 6 HR), sluníčka v mapě, seskupování, přiblížení okolí ubytování a karty s fotografiemi. Detail: skutečný příjezd k přístupovému bodu, návrat, pěší část, dítě, hodiny, vstupné, parkování, WC, jídlo, rizika, zdroje a navigace. Fotografie s autorem/licencí, ceny v obou měnách.
- Do hodiny musí vyjít oba silniční směry Valhalla bez živé dopravy. Ljubljana nesplnila limit ani po dálnici a není nabízena. Paklenica splní limit pouze po placené dálnici, výslovně označeno. Velika planina znamená příjezd k dolní stanici / veřejnému parkovišti, lanovka i pěší čas navíc.
- Výlety se samy nepřidávají do přejezdového itineráře ani rozpočtu. Benzín tam i zpět se počítá samostatně v detailu ze skutečných km obou směrů. Otevření a ceny bez spolehlivého zdroje označeny jako nepotvrzené. Podklady/reprodukce v README, data/excursions.json a data/excursion-routes.json.
- Ceny karet a detailu nyní zohledňují ostatní schválené etapy a skutečně zaplacené známky. Nahrazuje dřívější zobrazení samostatné etapy. Jde o mezní cenu oproti ostatním etapám; mezní částky se nesčítají. Přesný společný rozpočet a rozdíl při náhradě trasy zůstávají přístupné.
- Zakoupené známky jsou oddělené od výběru trasy v Settings.paidPasses a localStorage. Panel Náš rozpočet → Naše dálniční známky: potvrdit již koupenou podle návrhu, nebo vlastní platnost od/do a skutečnou cenu. Nic se tím nekupuje. Datum průjezdu rozhoduje, koncový den je včetně; kontrola i přes půlnoc.
- Plánovaný AT 1 den lze přepočítat na plán 10 dní (rozdíl 3,20 EUR), ale koupený AT 1 den se automaticky neupgraduje: pro pozdější návrat nově 9,60 EUR. Platné koupené AT/SI = nulový další výdaj. Úsekové a chorvatské mýto zůstává za každý průjezd.
- Rozpočet odlišuje celkem, už zaplaceno a zbývající odhad. Skutečné nákupy nezmizí po odebrání tras; lze odebrat pouze jejich místní záznam. Původní plány migrují bez ztráty údajů, neplatné/duplicitní záznamy jsou odmítnuty.
- Runtime ověřeno: schválit si-a → home-a má SI 0 a plánovaný AT rozdíl 3,20 EUR. Schválit návrat + označit AT10/SI7 za koupené → oba průjezdy 0, mýto home-a 43,90 EUR. Obnovení stránky uchová platnosti. Nahradit záznam AT10 skutečně koupenou AT1 z 12. 9. → pro návrat 16. 9. nově 9,60 EUR, SI stále 0. Celkový rozpočet zůstává při pouhém označení nákupu stejný, zbývající odhad klesne.
- V prohlížeči ověřeno kliknutí na značku Velika planina a Zadar, fotografie načtené, skupina Vransko jezero / Biograd → detail, přepnutí obou okolí a návrat k celé dovolené. Mobil 375 × 812: šířka stránky 360 px se scrollbarem, dialog 343 px bez přetečení; žádné chyby konzole. Zkušební plány i nákupy odstraněny přes UI, původní prázdný plán zachován.
- Context7 není dostupný; oficiální dokumentace a zdroje použity přímo. Vercel dosud není připojen: výsledek se nahrává na GitHub, místní produkční náhled 4174; netvrdit živé nasazení.
- Finální ověření tohoto rozšíření: všech 33 testů prošlo a produkční sestavení je úspěšné. Kontrola finálního sestavení při 375 px i 1280 px, konzole bez chyb. Kontrola zdrojů/diffu bez nálezu tajných klíčů; .env ignorován, autor commitu správný.


## Dokumentační uzavření session — 10. 9. 2026

- Na výslovné zadání uživatelky vzniklo sedm dokumentů v kořeni: PROJECT_CONTEXT.md, SESSION_SUMMARY.md, CURRENT_STATE.md, NEXT_STEPS.md, FILES_AND_MATERIALS.md, PROMPT_FOR_NEXT_MODEL.md a DO_NOT_CHANGE.md. Poslední prompt obsahuje i osmibodový rychlý start.
- Stav podložen kontrolou souborů, zdrojových modulů, původního zadání, README a Git historie. Funkční základ f97f920 už je na origin/main; tato změna upravuje pouze dokumentaci.
- Předání rozlišuje schválené chování, skutečné nákupy versus testovací volby, datové nejistoty, lokální preview versus nedoložené Vercel nasazení a historické versus současné ceny karet. Nejsou zadány nové funkce.
- Při dokumentační změně se neopakuje funkční testovací sada; poslední implementační výsledek 33 testů a runtime kontrola jsou zaznamenané jako předchozí ověření. Kontrolovány interní odkazy a existence uváděných hlavních souborů.

## Převzetí session a nasazení — 10. 9. 2026

- Nová relace převzala projekt podle sedmi handoff dokumentů. Ty byly dosud jen `staged`, nikoli commitnuté; commitnuto a pushnuto jako `510b0b5`.
- Lokální `git config user.email` v tomto repozitáři byl nastavený na starší `k.schmiedtova@seznam.cz`. Podle aktuální globální instrukce uživatelky tento e-mail od 9. 9. 2026 Vercel neuznává; opraveno na `zlatenkak@gmail.com`, tak i poslední commit. Čtyři dokumenty (DO_NOT_CHANGE, PROJECT_CONTEXT, PROMPT_FOR_NEXT_MODEL, README), které starý e-mail uváděly natvrdo, byly opraveny na odkaz k aktuální instrukci místo pevné hodnoty.
- Zjištěno, že GitHub repozitář `MlsnaMalina/cestovani` byl už ve skutečnosti propojen s Vercel (projekt `cestovani`, účet `mlsnamalinas-projects`) — dřívější dokumentace (CURRENT_STATE, PROJECT_CONTEXT, NEXT_STEPS) to mylně uváděla jako nedoložené/nepropojené. Push `510b0b5` spustil automatický produkční deploy, stav `Ready`.
- Živá URL **https://cestovani-orpin.vercel.app** otestována v prohlížeči (emulace 375 px i desktop): mapa a všech 6 variant první etapy se vykreslí, kliknutí na trasu otevře detail bez změny plánu, Náš rozpočet ukazuje správný prázdný stav, WC/Benzín výchozí vypnuté (0 míst), formulář „Zapsat vlastní zakoupenou známku“ uložil i odebral testovací rakouskou známku se správným přepočtem Kč/EUR a bez chyby (produkční CSP hlavičky nic neblokují), 375 px bez vodorovného přetečení (scrollWidth = clientWidth = 375), konzole bez chyb, síťové požadavky bez chyb a bez úniku localhost odkazů. Testovací záznam známky byl z UI odebrán.
- CURRENT_STATE.md a NEXT_STEPS.md aktualizovány, aby odpovídaly ověřenému stavu Vercelu; N3 označeno jako hotové. Zbývá D1 (fyzický Android) a doplnění pár neověřených provozních údajů před odjezdem 12. 9.

## Reset etapy, Souhrn a ověření sdílených známek — 10. 9. 2026

- Uživatelka zadala tři věci: reset volby u každé ze tří etap, čtvrtou záložku se souhrnem celé cesty (pro případ výpadku navigace) a ověření, že se dálniční známka mezi etapami skutečně nezdvojuje.
- **Reset:** nová `resetStage()` v `App.tsx` maže jen `plan[stageId]` (zachovává odjezd a ostatní etapy). Dostupná jako textové tlačítko „Zrušit výběr trasy pro tento den“ v denním plánu (viditelné jen když je etapa vybraná) a jako „Zrušit výběr“ na každé kartě v novém Souhrnu. Budget panel měl tuto možnost (ikonka koše) už dřív, beze změny.
- **Souhrn:** nová komponenta `Summary` a stav `view:'plan'|'summary'`. Čtvrté tlačítko „Souhrn“ vedle „Celá dovolená“ (obě ve sdíleném `.stages-extra`, CSS upraveno aby se na mobilu nepřekrývaly). Zobrazuje bez mapy pro všechny tři etapy: datum, zvolenou trasu (nebo výzvu „Vybrat trasu“), km/čas, časovou osu zastávek a cenu přes stejné `comparisonCosts()` jako zbytek aplikace — žádná nová cenová logika. Přepnutí na kteroukoli etapu nebo na Celou dovolenou vrací `view` na `'plan'`.
- **Ověření sdílených známek (runtime, `npm run dev`):** zvolena trasa B (přes Vídeň, Rakousko) pro Do Slovinska, poté prohlížena/zvolena trasa A pro Domů (také přes Rakousko). Karta Domů: „Slovinská známka 2A“ = **Zahrnuto v ostatních schválených etapách · 0,00 €** (SI7 12.9–18.9 z první etapy pokrývá i 16. 9.); „Rakouská známka“ = **3,20 €**, popsáno jako „Nová známka nebo změna dosud nekoupeného plánu“ s rozsahem 12.9–21.9 (rozšíření AT1→AT10, ne nová AT1 za 9,60 €). Po zrušení výběru první etapy stoupla cena Domů přesně o 22,40 € (= 9,60 + 16,00 − 3,20), tedy přesně o hodnotu sdílené slevy — potvrzuje správnou reaktivitu. Mechanismus (`comparisonCosts()` porovnává `budget()` s a bez dané etapy) byl funkční už předtím; jde o ověření, ne o opravu.
- Ověřeno i na mobilní šířce 375 px (bez vodorovného přetečení, `.stages-extra` tlačítka se nepřekrývají, reset tlačítko má plný dotykový cíl 44 px). `npm test` 33/33, `npm run build` bez chyb. Testovací volby po ověření odstraněny (`plan:{}` v localStorage dev serveru, oddělené od produkčního localStorage).
- CURRENT_STATE.md doplněn o řádky Reset volby etapy a Souhrn.

## Nové výlety, limit 100 minut a zdravotní upozornění — 11. 9. 2026

- Uživatelka chtěla přidat výlety Šibenik (natáčení Hry o trůny), vodopád Skradinski buk v NP Krka a Skradin. Skutečný dojezd (Valhalla, stejný nástroj jako appka): Skradin 55,5/59,9 min, Šibenik 67,0/69,9 min, Krka 65,4/66,6 min — dva ze tří byly nad původní 60minutový limit i po placené dálnici.
- Na výslovné zadání zvednut limit `scripts/acquire-excursions.mjs` a `excursionData.ts` z 60 na **100 minut** pro obě země, s novou výstrahou (červený trojúhelník + text) na kartě i v detailu u všeho nad 60 minut jedním směrem (`overHour()` v `excursionData.ts`). Vedlejší efekt: do nabídky se tím vrátila i dřív zamítnutá Lublaň (64–65 min) — uživatelka na to byla upozorněna předem.
- Výzkumný agent opravil chybu v původním zadání: **pevnost sv. Mihovila v Šibeniku nebyla natáčecím místem Hry o trůny.** Šibenik hrál Braavos v 5. sérii, natáčelo se u katedrály sv. Jakova a na pevnosti sv. Ivana; pevnost sv. Mihovila jen nabízí výhled na tato místa. Popis v `data/excursions.json` to takto přesně uvádí, nezůstala tam původní nesprávná domněnka.
- Přidány tři nové výlety (`trip-sibenik`, `trip-skradin`, `trip-krka`) se skutečnými cenami/hodinami/zdroji z roku 2026 a licencovanými fotkami z Wikimedia Commons (`data/photo-selection.mjs` → `scripts/acquire-photos.mjs`).
- Druhý požadavek: vyhledat místa se skutečným zdravotním/bezpečnostním rizikem (uživatelka jmenovala jako příklad západonilskou horečku) a označit je klikacím výstražným trojúhelníkem. Výzkum (ECDC, HZJZ, SZÚ, AGES, NIJZ) ukázal, že **západonilská horečka pro tuto trasu reálně nehrozí** — 0 hlášených případů v Zadarské župě i celém pobřeží v roce 2026, slovinské titulky o nákaze byly z roku 2024, ne 2026. Do appky proto přidána nebyla; uživatelka o tom byla informována místo tichého přidání nepodloženého varování.
- Skutečně potvrzená rizika: klíšťová encefalitida (Česko/Rakousko/Slovinsko patří mezi nejpostiženější země EU, polovina září je stále vrchol sezóny), mořští ježci a medúzy na plážích u Zadaru, růžkatice (poskok) v karstu kolem Paklenice. Nový sdílený katalog `data/health-advisories.json` (stejný vzor jako `data/sources.mjs`) + `healthAdvisories?:string[]` na `Place`/`ExcursionPlace` + resolver `resolveAdvisories()` v `planning.ts` + nová komponenta `src/HealthAdvisories.tsx` (`HazardTag`, `HazardNotes`).
- Přiřazeno: `tbe-forest` → Stromovka, Gleinkersee, Mondsee, pramen Kamniške Bistrice (zastávka i výlet), Arboretum Volčji Potok; `coast-sea-safety` → Nin, Biograd; `paklenica-viper` → Paklenica. Vransko jezero vědomě nebylo označeno — výzkum ho vyhodnotil jako běžné komářské nepohodlí, ne zdravotní riziko.
- Mapová značka dostala odznak s trojúhelníkem (`.hazard-badge`, stejný vzor jako existující `.facility-count`/skupinový odznak u výletů); u seskupených výletních značek ustupuje početnímu odznaku, aby se neprekrývaly.
- Ověřeno runtime (`npm run dev`): hazard tag na kartě zastávky i výletu, plný text upozornění se zdroji a datem v detailu, správný přepočet Kč/€ u nových cen, `overHour`/`paidAlternative` na kartách Šibeniku/Skradinu/Krky/Lublaně přesně odpovídají skutečným datům z `excursion-routes.json`, 375 px bez přetečení. Mapová WebGL vrstva se v tomto prohlížecím prostředí nevykreslila (panel byl skrytý), takže odznak na mapové značce zůstává k vizuálnímu ověření na živém webu / telefonu — logika i CSS ale přesně kopírují už fungující vzor.
- Cestou k opravě odhalena a opravená latentní křehkost `raw as Dataset` přetypování ve čtyřech testovacích souborech (TypeScript nedokázal odvodit `Point` z rozsáhlého JSON po přidání pole `healthAdvisories` do `Dataset`); opraveno na `as unknown as Dataset` podle doporučení TypeScriptu, bez dopadu na běh appky.
- `npm test` 34/34, `npm run build` bez chyb. Vytvořen `.claude/launch.json` pro dev server (port 5173).

## Rozpisy a stažení do telefonu — 12. 9. 2026
- Přidány české pokyny pro všech 12 tras (663 základních manévrů) a všech 49 vazeb zajížděk z uložených Valhalla dat. Vybrané pauzy nahrazují příslušný úsek základních pokynů; kilometry se přepočítají. Názvy směrů a sjezdů se zachovávají z instrukcí, nejsou fyzicky ověřené na místě.
- Roadbook.tsx / roadbookData.ts: rozpis v denním detailu a Souhrnu, ceny obou měn, celé nákupní produkty a platnosti, zaplacené známky, mýto a oficiální prodejci. Sdílení známek používá dosavadní budget/comparisonCosts.
- Souhrn nabízí jeden samostatný HTML export celého schváleného plánu se SVG mapou koridorů a vybranými zastávkami. Jednotlivé etapy mají vlastní export. Žádné síťové závislosti; bez fotografií, podkladových dlaždic a GPS navigace. Mapa je orientační, kliknutí přejde na rozpis etapy. Žádná synchronizace nebo instalace PWA.
- Ověření pravidel nákupu/platnosti 11. 9. 2026 z ASFINAG, DARS, HAC a AZM. Tarifní základ aplikace zůstává 8. 9. 2026.
- Ověření: 40 testů a produkční build prošly. UI vytvořilo skutečný soubor ve Stažených souborech; jeho kopie zobrazená samostatně obsahuje 2 mapové linie, oba rozpisy a žádné externí skripty/obrázky/styly. Odkaz na návrat funguje; šířka 375 px bez přetečení. Tiskové tlačítko volá tisk prohlížeče; systémový PDF dialog ve vestavěném prohlížeči není dostupný k vizuální kontrole. Fyzický Android neověřen.
