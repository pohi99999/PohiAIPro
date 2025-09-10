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
*   **Új Komponensek Létrehozása:** React komponensek írása TypeScriptben a `pages` és `src/components` könyvtárakba.
*   **Backend Logika Implementálása:** Firebase Cloud Functions (TypeScript) fejlesztése a `functions/src` könyvtárban.
*   **API Integráció:** A `BrunellaAgentSystem`-mel való kommunikáció implementálása az `API_CONTRACT.md` alapján.

### 3.2. Tesztelés
*   **Unit Tesztek Írása:** Minden új komponenshez és üzleti logikai függvényhez hozz létre unit teszteket a `vitest` és a `React Testing Library` segítségével. A teszteknek a forráskóddal megegyező könyvtárban kell lenniük (`.test.ts` vagy `.test.tsx` végződéssel).
*   **Integrációs Tesztek:** Komplexebb felhasználói folyamatokhoz (pl. bejelentkezés, adatküldés) írj integrációs teszteket.
*   **Kódlefedettség Növelése:** Törekedj a minél magasabb kódlefedettség elérésére.

### 3.3. Hibakeresés (Debugging)
*   A bejelentett hibák okának felderítése a kód elemzésével és a tesztek futtatásával.
*   Javaslatok tétele a hibák javítására és a javítások implementálása.

### 3.4. Kódminőség és Refaktorálás
*   A meglévő kódbázis folyamatos refaktorálása a jobb olvashatóság, karbantarthatóság és teljesítmény érdekében.
*   Az ESLint és Prettier szabályok betartása és betartatása.

## 4. Működési Elvek

*   **Kommunikáció:** Minden lépésedről és tervedről tájékoztasd Brunellát.
*   **Verziókezelés:** Minden módosítást egy új Git branch-en végezz, és Pull Requestet nyiss a `main` ágra.
*   **Dokumentáció:** A kódodat írd érthetően, és szükség esetén adj hozzá JSDoc kommenteket.

Üdv a csapatban!

---

## 5. Aktuális Feladat: Kritikus Teszthiba Javítása (Prioritás #1)

**Probléma Leírása:**
A projekt tesztfuttatásai (`npm run test`) konzisztensen elbuknak egy "JavaScript heap out of memory" hibával. A hibát a `src/test/hooks.test.ts` tesztfájl okozza. A feladatod ennek a memóriaszivárgási problémának a felderítése és javítása, hogy a projekt teszt-suite-ja újra stabil és megbízható legyen.

**Részletes Teendők:**

1.  **Hiba Reprodukálása:**
    *   Futtasd a `npm run test` parancsot, hogy magad is lásd a hibajelenséget.

2.  **Kód Analízis:**
    *   Vizsgáld meg alaposan a `src/test/hooks.test.ts` fájlt.
    *   Fókuszálj a `renderHook` használatára és a `useEffect` hook-okban lévő `onSnapshot` listenerekre. Ellenőrizd, hogy a listenerek leiratkozása (cleanup) minden esetben megtörténik-e a komponens "unmount"-olásakor.
    *   Elemezd a kapcsolódó `lib/hooks.ts` fájlt is, hogy megértsd a tesztelt hook-ok belső működését.

3.  **Hibakeresés:**
    *   Használj memóriakezelést támogató hibakeresési technikákat. Ha a környezeted engedi, futtass egy memória-profilert a teszteken, hogy pontosan lásd, melyik objektum vagy függvény okozza a szivárgást.

4.  **Javítás és Verifikálás:**
    *   Implementáld a javítást a kódba.
    *   Futtasd újra a teljes tesztcsomagot (`npm run test`), hogy megbizonyosodj arról, hogy a hiba elhárult, és nem keletkezett újabb regresszió.

5.  **Dokumentáció:**
    *   Ha végeztél, ebben a dokumentumban, egy új alfejezetben (`### 5.1. Teszthiba Javításának Dokumentációja`), foglald össze a következőket:
        *   **Hiba Oka:** Mi volt a memóriaszivárgás gyökéroka?
        *   **Javítási Folyamat:** Milyen lépéseket tettél a hiba elhárítására?
        *   **Végeredmény:** Hogyan oldottad meg a problémát, és mi a tanulság a jövőre nézve?

Sok sikert a feladathoz!