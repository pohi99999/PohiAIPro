### **Stratégiai Fejlesztési Terv: Pohi AI Pro Platform**

**Jelenlegi státusz (2025-08-26):** Az 1. Fázis (Backend Migráció) és a 2. Fázis (Valós idejű funkciók és Fájlkezelés) nagy része befejeződött. Az alkalmazás most már Firebase backendet használ hitelesítésre, adatbázis-műveletekre és fájltárolásra. A következő lépés a 2. Fázis MI képességeinek bővítése.

---

#### **1. Fázis: Alapozás – Backend Migráció és Adatstruktúra Véglegesítése (Befejezve)**

**Cél:** A jelenlegi, frontend-oldali adatkezelés leváltása egy skálázható, biztonságos és valós idejű backend infrastruktúrára.

**Cselekvési Lépések:**

1.  **Infrastruktúra Felállítása:** - **KÉSZ**
    *   **Projekt Létrehozása:** A felhasználó létrehozta a Firebase projektet.
    *   **Szolgáltatások Aktiválása:** Firestore, Authentication, Storage engedélyezve.
2.  **Adatmodell Tervezése:** - **KÉSZ**
    *   **Séma Kialakítása:** A séma a `types.ts` alapján lett kialakítva.
3.  **Backend Integráció és Adatmigráció:** - **KÉSZ**
    *   **Firebase SDK Integrálása:** A kliensoldali Firebase SDK integrálva lett.
    *   **Adatmigrációs Script:** Az `npm run migrate:data` script elkészült.
4.  **Hitelesítés Implementálása:** - **KÉSZ**
    *   A placeholder bejelentkezés le lett cserélve Firebase Authentication-re (Email/Jelszó, Google).

---

#### **2. Fázis: Funkcionális Bővítés – Valós Idő és MI Képességek (Folyamatban)**

**Cél:** A stabil backend alapokra építve bevezetni azokat a kulcsfontosságú funkciókat, amelyek a platformot valóban interaktívvá és intelligenssé teszik.

**Cselekvési Lépések:**

1.  **Valós Idejű Funkciók:** - **KÉSZ**
    *   **Értesítések:** A valós idejű értesítési rendszer a Firestore `onSnapshot` segítségével implementálva lett.
    *   **Üzenetküldés:** Az alapvető üzenetküldő modul a Firestore segítségével kiépítve.
2.  **Fájlkezelés:** - **KÉSZ**
    *   **Képfeltöltés:** A Firebase Storage integrálva lett a termékfotók feltöltéséhez.
3.  **MI Képességek Kibővítése:** - **Folyamatban**
    *   **Tranzakciós Adatgyűjtés:** - **Előkészítve**
        *   `Transaction` típus létrehozva a `types.ts`-ben.
        *   `transactions` kollekció szabályai hozzáadva a `firestore.rules`-hoz.
    *   **Multimodális Bemenet:** - **Előkészítve**
        *   Új `onFileUpload` Cloud Function létrehozva a PDF-ek Gemini API-val történő elemzésére.
        *   Szükséges függőségek hozzáadva a `functions/package.json`-hoz.
        *   *Felhasználói teendő: Firebase CLI beállítása és a `GEMINI_API_KEY` titok létrehozása.*
    *   **Dokumentumkezelés:** - **Elkezdve**
        *   Új `AdminDocumentsPage.tsx` oldal létrehozva.
        *   `useGooglePicker` hook implementálva a `lib/hooks.ts`-ben a Google Drive integrációhoz.
        *   *Felhasználói teendő: Google Cloud `developerKey` és `clientId` beszerzése, és a routing beállítása.*

---

#### **3. Fázis: Terjeszkedés – Mobil Platform és Ipari Általánosítás (Tervezett)**

**Cél:** A webalkalmazás sikerére építve a platform kiterjesztése mobilra, valamint az adatmodell és az üzleti logika általánosítása a jövőbeli iparági vertikumok támogatásához.

---

#### **Kódminőség- és Biztonságjavítási Fázis (2025-09-04, Befejezve)**
**Cél:** Az alkalmazás kódminőségének, karbantarthatóságának, biztonságának és logikájának proaktív javítása.

**Cselekvési Lépések:**
1.  **Kódminőség Javítása:** - **KÉSZ**
    *   Minden (21 db) linter hiba javítva a kódbázisban.
    *   A központi React hook-ok (`useCollectionQuery`, `useGooglePicker`) refaktorálva lettek a teljesítmény és a logikai helyesség javítása érdekében.
2.  **Biztonsági Frissítések:** - **KÉSZ**
    *   9 sebezhetőség (köztük 4 kritikus) javítva a projekt függőségeinek frissítésével (`npm audit`).
3.  **Konfiguráció Javítása:** - **KÉSZ**
    *   A merevkódolt API kulcsok eltávolításra kerültek, helyettük biztonságos, környezeti változókon alapuló megoldás lett implementálva.
4.  **Ellenőrzés:** - **KÉSZ**
    *   Minden változtatás ellenőrizve lett a meglévő tesztcsomaggal, amely továbbra is sikeresen lefut.

---

### **Összegzés és Következő Lépések**

A rendszer sikeresen át lett állítva egy modern, Firebase-alapú backendre. A kódminőség és biztonság jelentősen javult. A következő nagy lépés a mesterséges intelligencia képességek mélyebb integrálása a 2. Fázisban leírtak szerint.