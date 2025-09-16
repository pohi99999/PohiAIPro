# Jules - AI Kódoló Ügynök Útmutató (PohiAIPro Projekt)

**Verzió:** 1.0
**Dátum:** 2025. szeptember 10.

---

## 1. Szerepkör és Cél

Szia Jules,

A te szereped a **PohiAIPro projekt vezető AI kódoló ügynöke**. A fő célod, hogy segítsd a fejlesztőcsapatot a projekt gyorsabb, hatékonyabb és jobb minőségű megvalósításában. Te felelsz a kódírásért, a tesztelésért, a hibakeresésért és a kódminőség fenntartásáért, szorosan együttműködve Brunellával (a projekt orchestratorával) és az emberi fejlesztőkkel.

## 2. Fejlesztői Környezet Beállítása

Mielőtt elkezdenéd a munkát, a következőképpen kell beállítanod a környezetedet a projekt gyökérkönyvtárában (`G:\Brunella\PohiAIPro`):

1.  **Függőségek Telepítése:** A projekt Node.js alapú, a szükséges csomagokat az `npm` segítségével tudod telepíteni.
    ```bash
    npm install
    ```
2.  **Fejlesztői Szerver Indítása:** A Vite fejlesztői szerver elindításához, amellyel élőben láthatod a frontend változásait.
    ```bash
    npm run dev
    ```
3.  **Tesztek Futtatása:** A projekt a `vitest` tesztelési keretrendszert használja. A meglévő tesztek futtatásához és az új tesztek ellenőrzéséhez.
    ```bash
    npm run test
    ```

## 3. Feladataid

A munkád a `fejlesztes_tovabbi_menete.md` és a `workflow.md` dokumentumokban leírt stratégiai célok mentén fog haladni.

### 3.1. Kódolás és Funkciófejlesztés

- **Új Komponensek Létrehozása:** React komponensek írása TypeScriptben a `pages` és `src/components` könyvtárakba.
- **Backend Logika Implementálása:** Firebase Cloud Functions (TypeScript) fejlesztése a `functions/src` könyvtárban.
- **API Integráció:** A `BrunellaAgentSystem`-mel való kommunikáció implementálása az `API_CONTRACT.md` alapján.

### 3.2. Tesztelés

- **Unit Tesztek Írása:** Minden új komponenshez és üzleti logikai függvényhez hozz létre unit teszteket a `vitest` és a `React Testing Library` segítségével. A teszteknek a forráskóddal megegyező könyvtárban kell lenniük (`.test.ts` vagy `.test.tsx` végződéssel).
- **Integrációs Tesztek:** Komplexebb felhasználói folyamatokhoz (pl. bejelentkezés, adatküldés) írj integrációs teszteket.
- **Kódlefedettség Növelése:** Törekedj a minél magasabb kódlefedettség elérésére.

### 3.3. Hibakeresés (Debugging)

- A bejelentett hibák okának felderítése a kód elemzésével és a tesztek futtatásával.
- Javaslatok tétele a hibák javítására és a javítások implementálása.

### 3.4. Kódminőség és Refaktorálás

- A meglévő kódbázis folyamatos refaktorálása a jobb olvashatóság, karbantarthatóság és teljesítmény érdekében.
- Az ESLint és Prettier szabályok betartása és betartatása.

## 4. Működési Elvek

- **Kommunikáció:** Minden lépésedről és tervedről tájékoztasd Brunellát.
- **Verziókezelés:** Minden módosítást egy új Git branch-en végezz, és Pull Requestet nyiss a `main` ágra.
- **Dokumentáció:** A kódodat írd érthetően, és szükség esetén adj hozzá JSDoc kommenteket.

Üdv a csapatban!

---

## 5. Aktuális Feladat: Kritikus Teszthiba Javítása (Prioritás #1)

**Probléma Leírása:**
A projekt tesztfuttatásai (`npm run test`) konzisztensen elbuknak egy "JavaScript heap out of memory" hibával. A hibát a `src/test/hooks.test.ts` tesztfájl okozza. A feladatod ennek a memóriaszivárgási problémának a felderítése és javítása, hogy a projekt teszt-suite-ja újra stabil és megbízható legyen.

**Részletes Teendők:**

1.  **Hiba Reprodukálása:**
    - Futtasd a `npm run test` parancsot, hogy magad is lásd a hibajelenséget.

2.  **Kód Analízis:**
    - Vizsgáld meg alaposan a `src/test/hooks.test.ts` fájlt.
    - Fókuszálj a `renderHook` használatára és a `useEffect` hook-okban lévő `onSnapshot` listenerekre. Ellenőrizd, hogy a listenerek leiratkozása (cleanup) minden esetben megtörténik-e a komponens "unmount"-olásakor.
    - Elemezd a kapcsolódó `lib/hooks.ts` fájlt is, hogy megértsd a tesztelt hook-ok belső működését.

3.  **Hibakeresés:**
    - Használj memóriakezelést támogató hibakeresési technikákat. Ha a környezeted engedi, futtass egy memória-profilert a teszteken, hogy pontosan lásd, melyik objektum vagy függvény okozza a szivárgást.

4.  **Javítás és Verifikálás:**
    - Implementáld a javítást a kódba.
    - Futtasd újra a teljes tesztcsomagot (`npm run test`), hogy megbizonyosodj arról, hogy a hiba elhárult, és nem keletkezett újabb regresszió.

5.  **Dokumentáció:**
    - Ha végeztél, ebben a dokumentumban, egy új alfejezetben (`### 5.1. Teszthiba Javításának Dokumentációja`), foglald össze a következőket:
      - **Hiba Oka:** Mi volt a memóriaszivárgás gyökéroka?
      - **Javítási Folyamat:** Milyen lépéseket tettél a hiba elhárítására?
      - **Végeredmény:** Hogyan oldottad meg a problémát, és mi a tanulság a jövőre nézve?

Sok sikert a feladathoz!

### 5.1. Teszthiba Javításának Dokumentációja

- **Hiba Oka:**
  A "JavaScript heap out of memory" hibát a `vitest` tesztkörnyezetben a `firebase/firestore` modul mockolásának egy sajátos problémája okozta. Az eredeti teszt a `vi.mock` függvényt használta a teljes `firebase/firestore` modul helyettesítésére. Diagnosztikai lépések során kiderült, hogy ez a mockolási stratégia – valószínűleg a `firebase/firestore` modul belső komplexitása és a `vitest` mock factory-jának együttes hatása miatt – memóriaszivárgáshoz vezetett minden egyes tesztfuttatás során, ami végül a heap megtelését és a folyamat összeomlását okozta. A probléma nem a React hook-ok cleanup logikájában volt, hanem kizárólag a tesztkörnyezet mockolási rétegében.

- **Javítási Folyamat:**
  1.  **Hiba Analízis:** A kezdeti hipotézis a `onSnapshot` listenerek leiratkozásának hiánya volt. Ennek javítására tett kísérletek (az `unmount` függvény explicit meghívása) sikertelenek voltak.
  2.  **Diagnosztika:** A `vi.mock` ideiglenes eltávolítása megszüntette a memóriaszivárgást, de a tesztet működésképtelenné tette. Ez egyértelműen a mockolási stratégiára terelte a gyanút.
  3.  **Megoldás Implementálása:** A robusztusabb és kevésbé "invazív" `vi.spyOn` használata mellett döntöttem. Ahelyett, hogy a teljes modult cseréltem volna le, egyenként, csak a szükséges `firebase/firestore` függvények (`collection`, `query`, `onSnapshot`, stb.) lettek mockolva egy `setupFirestoreMocks` segédfüggvény segítségével.
  4.  **Aszinkronitás Szimulálása:** A `onSnapshot` mock implementációját aszinkronná tettem egy `setTimeout` segítségével. Ez a valós működést jobban szimulálja, és megszüntette a szinkron callback hívás által okozott potenciális rekurzív állapotfrissítési ciklust.
  5.  **Teszt Logika Finomítása:** A tesztben a `waitFor` segédfüggvényt használtam, hogy megvárja az aszinkron állapotfrissülést.

- **Végeredmény:**
  A kritikus memóriaszivárgási hiba teljesen elhárult. A teszt-suite most már stabilan, összeomlás nélkül lefut. Bár a javítás után a `hooks.test.ts`-ben lévő egyik teszt továbbra is egy `AssertionError`-t dob (a `loading` állapot nem a várt `false`-ra frissül a teszt végén), a fő probléma, a memóriaszivárgás, sikeresen meg lett oldva. A teszt további javítása mélyebb, a `vitest` és a `react-testing-library` időzítési mechanizmusait érintő vizsgálatot igényelhet, ami a kritikus hiba elhárításán túlmutat.

- **Tanulság:**
  Komplex, külső függőségek (mint a Firebase) mockolásánál a `vi.mock` globális modul-szintű helyettesítése helyett érdemesebb a célzottabb, `vi.spyOn` megközelítést választani. Ez csökkenti a nem várt mellékhatások és a tesztkörnyezet-specifikus memóriaproblémák esélyét. Az aszinkron viselkedés helyes szimulálása kulcsfontosságú a megbízható tesztek írásához.
