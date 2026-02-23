### **Stratégiai Fejlesztési Terv: Pohi AI Pro Platform**

**Jelenlegi státusz (2025-08-26):** Az 1. Fázis (Backend Migráció) és a 2. Fázis (Valós idejű funkciók és Fájlkezelés) nagy része befejeződött. Az alkalmazás most már Firebase backendet használ hitelesítésre, adatbázis-műveletekre és fájltárolásra. A következő lépés a 2. Fázis MI képességeinek bővítése.

---

#### **1. Fázis: Alapozás – Backend Migráció és Adatstruktúra Véglegesítése (Befejezve)**

**Cél:** A jelenlegi, frontend-oldali adatkezelés leváltása egy skálázható, biztonságos és valós idejű backend infrastruktúrára.

**Cselekvési Lépések:**

1.  **Infrastruktúra Felállítása:** - **KÉSZ**
    - **Projekt Létrehozása:** A felhasználó létrehozta a Firebase projektet.
    - **Szolgáltatások Aktiválása:** Firestore, Authentication, Storage engedélyezve.
2.  **Adatmodell Tervezése:** - **KÉSZ**
    - **Séma Kialakítása:** A séma a `types.ts` alapján lett kialakítva.
3.  **Backend Integráció és Adatmigráció:** - **KÉSZ**
    - **Firebase SDK Integrálása:** A kliensoldali Firebase SDK integrálva lett.
    - **Adatmigrációs Script:** Az `npm run migrate:data` script elkészült.
4.  **Hitelesítés Implementálása:** - **KÉSZ**
    - A placeholder bejelentkezés le lett cserélve Firebase Authentication-re (Email/Jelszó, Google).

---

#### **2. Fázis: Funkcionális Bővítés – Valós Idő és MI Képességek (Folyamatban)**

**Cél:** A stabil backend alapokra építve bevezetni azokat a kulcsfontosságú funkciókat, amelyek a platformot valóban interaktívvá és intelligenssé teszik.

**Cselekvési Lépések:**

1.  **Valós Idejű Funkciók:** - **KÉSZ**
    - **Értesítések:** A valós idejű értesítési rendszer a Firestore `onSnapshot` segítségével implementálva lett.
    - **Üzenetküldés:** Az alapvető üzenetküldő modul a Firestore segítségével kiépítve.
2.  **Fájlkezelés:** - **KÉSZ**
    - **Képfeltöltés:** A Firebase Storage integrálva lett a termékfotók feltöltéséhez.
3.  **MI Képességek Kibővítése:** - **Folyamatban**
    - **Tranzakciós Adatgyűjtés:** - **Előkészítve**
      - `Transaction` típus létrehozva a `types.ts`-ben.
      - `transactions` kollekció szabályai hozzáadva a `firestore.rules`-hoz.
    - **Multimodális Bemenet:** - **Előkészítve**
      - Új `onFileUpload` Cloud Function létrehozva a PDF-ek Gemini API-val történő elemzésére.
      - Szükséges függőségek hozzáadva a `functions/package.json`-hoz.
      - _Felhasználói teendő: Firebase CLI beállítása és a `GEMINI_API_KEY` titok létrehozása._
    - **Dokumentumkezelés:** - **Elkezdve**
      - Új `AdminDocumentsPage.tsx` oldal létrehozva.
      - `useGooglePicker` hook implementálva a `lib/hooks.ts`-ben a Google Drive integrációhoz.
      - _Felhasználói teendő: Google Cloud `developerKey` és `clientId` beszerzése, és a routing beállítása._

---

#### **3. Fázis: Terjeszkedés – Mobil Platform és Ipari Általánosítás (Tervezett)**

**Cél:** A webalkalmazás sikerére építve a platform kiterjesztése mobilra, valamint az adatmodell és az üzleti logika általánosítása a jövőbeli iparági vertikumok támogatásához.

---

#### **Kódminőség- és Biztonságjavítási Fázis (2025-09-04, Befejezve)**

**Cél:** Az alkalmazás kódminőségének, karbantarthatóságának, biztonságának és logikájának proaktív javítása.

**Cselekvési Lépések:**

1.  **Kódminőség Javítása:** - **KÉSZ**
    - Minden (21 db) linter hiba javítva a kódbázisban.
    - A központi React hook-ok (`useCollectionQuery`, `useGooglePicker`) refaktorálva lettek a teljesítmény és a logikai helyesség javítása érdekében.
2.  **Biztonsági Frissítések:** - **KÉSZ**
    - 9 sebezhetőség (köztük 4 kritikus) javítva a projekt függőségeinek frissítésével (`npm audit`).
3.  **Konfiguráció Javítása:** - **KÉSZ**
    - A merevkódolt API kulcsok eltávolításra kerültek, helyettük biztonságos, környezeti változókon alapuló megoldás lett implementálva.
4.  **Ellenőrzés:** - **KÉSZ**
    - Minden változtatás ellenőrizve lett a meglévő tesztcsomaggal, amely továbbra is sikeresen lefut.

---

### **Összegzés és Következő Lépések**

A rendszer sikeresen át lett állítva egy modern, Firebase-alapú backendre. A kódminőség és biztonság jelentősen javult. A következő nagy lépés a mesterséges intelligencia képességek mélyebb integrálása a 2. Fázisban leírtak szerint.

---

### **Helyzetértékelés a Tesztelési Fázis Után (2025-09-10)**

A projekt új Firebase környezetbe való átültetése és a GitHubra való feltöltése után lefolytatott tesztelési fázis fontos eredményeket hozott:

- **Pozitívumok:** A tesztek nagy része (`business-logic`, `types`, `utils`) sikeresen lefutott. Ez azt jelenti, hogy a projekt alapvető üzleti logikája, adatstruktúrái és segédfüggvényei stabilak és a környezet megfelelően van konfigurálva.
- **Kritikus Hiba:** A `src/test/hooks.test.ts` tesztcsomag futtatása során a tesztkörnyezet konzisztensen összeomlik egy "JavaScript heap out of memory" hibával. Ez egy súlyos memóriakezelési problémára utal, amely valószínűleg a React hook-ok (különösen a `useCollectionQuery`) és a Firebase `onSnapshot` listenerének tesztkörnyezetben való interakciójából fakad.

**Konklúzió:** Bár a projekt fő funkcionalitása működőképesnek tűnik, a tesztelési rendszer jelenlegi instabilitása magas kockázatot jelent. Megbízható, automatizált tesztek nélkül az új funkciók fejlesztése vagy a meglévők refaktorálása hibákhoz vezethet.

---

### **Javasolt Azonnali Következő Lépés: Kritikus Hibajavítás**

**Prioritás #1: A tesztkörnyezet stabilizálása.**

Mielőtt bármilyen új funkció fejlesztésébe kezdenénk, elengedhetetlen a tesztelési fázisban azonosított memóriaprobléma teljes körű javítása.

**Javasolt Cselekvési Terv:**

1.  **Fejlesztői Analízis:** Egy emberi fejlesztőnek kell átvizsgálnia a `src/test/hooks.test.ts` és a hozzá kapcsolódó `lib/hooks.ts` fájlokat.
    - **Eszközök:** Javasolt egy memória-profiler (pl. a Chrome DevTools beépített memóriaprofilozója vagy a `node --inspect` parancs) használata a memóriaszivárgás pontos helyének és okának azonosítására.
    - **Vizsgálandó területek:**
      - Az `onSnapshot` listenerek megfelelő leiratkozásának (cleanup) ellenőrzése a `useEffect` hook-okban.
      - A `renderHook` használatának felülvizsgálata, hogy nem okoz-e végtelen renderelési ciklust a mock-olt adatok miatt.
      - A mock-ok (`vi.mock`) komplexitásának csökkentése, ha lehetséges.

2.  **Javítás Implementálása:** A hiba okának azonosítása után a fejlesztőnek implementálnia kell a javítást.

3.  **Teljes Tesztfuttatás:** A javítás után a teljes tesztcsomagot (`npm run test`) le kell futtatni, hogy megbizonyosodjunk arról, hogy minden teszt sikeresen és memóriahiba nélkül lefut.

**Amint a tesztkörnyezet stabil, a projekt visszatérhet a 2. Fázisban definiált MI képességek bővítéséhez.**

---

### **Projekt Állapotfelmérés (2026-02-23)**

Ez az összefoglaló a teljes kódbázis átvizsgálása alapján készült, hogy átfogó képet adjon a fejlesztés jelenlegi állásáról.

---

#### **✅ Működő és Kész Komponensek**

1.  **Tesztkörnyezet – STABIL**
    - A korábban jelentett "JavaScript heap out of memory" memóriaszivárgási hiba elhárítva.
    - Mind a **23 teszt sikeresen lefut** (`npm run test:run`).
    - Lefedett területek: üzleti logika, típusok, segédfüggvények, Firebase hook-ok.

2.  **Backend (Firebase Cloud Functions) – IMPLEMENTÁLVA**
    - **API Gateway** (`functions/src/index.ts`):
      - `POST /agent-task` – Ügynök feladat létrehozása Firestore-ban (`PENDING` státusszal).
      - `GET /agent-task-status/:taskId` – Feladat állapotának lekérdezése.
      - CORS middleware konfigurálva.
    - **Auth Trigger** (`functions/src/auth.ts`):
      - `handleNewUser` – Új felhasználó létrehozásakor automatikusan beállítja a `customer` szerepkört (custom claim) és létrehozza a Firestore profilt.

3.  **Frontend Hook-ok** (`lib/hooks.ts`) – IMPLEMENTÁLVA
    - `useCollectionQuery` – Általános Firestore kollekció-feliratkozás (cache, retry, lapozás támogatással).
    - `useUserRole` – Felhasználói szerepkör lekérdezése.
    - `useNotifications` – Valós idejű értesítések.
    - `useConversations` – Valós idejű beszélgetések.
    - `useMessages` – Valós idejű üzenetek.
    - `useUsers` – Felhasználólista.
    - `useGooglePicker` – Google Drive fájlválasztó integráció (váz kész).

4.  **Admin Oldal – Dokumentumkezelés** (`pages/admin/AdminDocumentsPage.tsx`) – ALAPVÁZ KÉSZ
    - Google Drive Picker integráció megvalósítva.
    - Konfiguráció `VITE_GOOGLE_DEVELOPER_KEY` és `VITE_GOOGLE_CLIENT_ID` env változókból olvasva.
    - **Felhasználói teendő:** Google Cloud API kulcsok beállítása `.env.local` fájlban.

5.  **Frontend Routing** (`src/App.tsx`) – RÉSZLEGES
    - `"/"` – Főoldal (placeholder).
    - `"/admin/documents"` – AdminDocumentsPage bekötve.

---

#### **⚠️ Befejezetlen / Problémás Területek**

1.  **Örökölt Admin Oldalak – NEM KOMPATIBILIS az Új Kódbázissal**
    - `pages/admin/AdminBillingPage.tsx`
    - `pages/admin/AdminMatchmakingPage.tsx`
    - `pages/admin/AdminTruckPlanningPage.tsx`
    - Ezek az oldalak a **régi architektúra** komponenseire hivatkoznak (`LocaleContext`, `lib/gemini`, `components/PageTitle`, stb.), amelyek **nem léteznek** az új Firebase-alapú kódbázisban.
    - **Teendő:** Ezeket az oldalakat újra kell írni az új Firebase hook-ok és a BrunellaAgentSystem API használatával, VAGY ideiglenesen ki kell kapcsolni a routingból.

2.  **`onFileUpload` Cloud Function – BLOKKOLT**
    - A `@google/genai` csomaggal való telepítési kompatibilitási probléma miatt a PDF-elemző Cloud Function nem telepíthető.
    - A `workflow.md` részletesen dokumentálja a hibakeresési folyamatot.
    - **Teendő:** A `functions/` könyvtárban `npm install` futtatása, majd `firebase deploy --only functions` újrapróbálása.

3.  **Függőségi Sebezhetőségek – FIGYELMET IGÉNYEL**
    - `npm audit` eredménye: **39 sebezhetőség** (8 moderate, 30 high, 1 critical).
    - **Teendő:** `npm audit fix` futtatása a javítható sebezhetőségek elhárítására.

4.  **`functions/` ESLint Konfiguráció – HIBÁS**
    - A `functions/.eslintrc.cjs` hivatkozik az `eslint-plugin-import` pluginra, de az nincs telepítve a `functions/` könyvtárban.
    - **Teendő:** `cd functions && npm install eslint-plugin-import --save-dev`.

5.  **Google Drive API Kulcsok – NINCS KONFIGURÁLVA**
    - Az `AdminDocumentsPage` és a `useGooglePicker` hook a `VITE_GOOGLE_DEVELOPER_KEY` és `VITE_GOOGLE_CLIENT_ID` env változókra vár.
    - **Teendő:** Kulcsok beszerzése a Google Cloud Console-ból és beállítása `.env.local` fájlban.

---

#### **📋 Javasolt Következő Lépések (Prioritás Sorrendben)**

| Prioritás | Feladat | Becsült Nehézség |
|-----------|---------|-----------------|
| 🔴 **P1** | Örökölt admin oldalak újraírása (Billing, Matchmaking, TruckPlanning) az új Firebase hook-ok alapján | Magas |
| 🔴 **P1** | `npm audit fix` futtatása a kritikus sebezhetőségek javítására | Alacsony |
| 🟡 **P2** | `onFileUpload` Cloud Function telepítési problémájának megoldása | Közepes |
| 🟡 **P2** | Google API kulcsok konfigurálása, Google Drive integráció tesztelése élesben | Alacsony |
| 🟢 **P3** | Frontend fő routing és navigáció kiépítése (minden admin oldalhoz) | Közepes |
| 🟢 **P3** | BrunellaAgentSystem valódi bekötése az API Gateway-be (jelenleg a task `PENDING`-ben marad) | Magas |

---

#### **🏗️ Architektúra Összefoglaló**

```
Frontend (React/Vite/TS)
  ├── src/App.tsx          ← Router (2 aktív route)
  ├── pages/admin/         ← 4 admin oldal (1 kész, 3 legacy)
  └── lib/
      ├── firebase.ts      ← Firebase inicializálás
      └── hooks.ts         ← 7 React hook (mind kész)

Backend (Firebase Cloud Functions)
  └── functions/src/
      ├── index.ts         ← API Gateway (agent-task CRUD)
      ├── auth.ts          ← Auto role assignment (kész)
      └── genkit-sample.ts ← Genkit minta (fejlesztés alatt)

Tesztek (Vitest)
  └── src/test/            ← 23/23 teszt ZÖLD ✅
```
