# Pohi AI Pro - API Contract v1.0

**Dátum:** 2025. szeptember 9.
**Státusz:** Javaslat

Ez a dokumentum definiálja a Pohi AI Pro frontend/backend és a BrunellaAgentSystem (BAS) közötti kommunikációs szerződést.

---

## Alapelv

A kommunikáció aszinkron módon történik. A Pohi AI Pro backend egy feladatot (task) indít a BAS felé, és azonnal visszakap egy egyedi feladat-azonosítót (`task_id`). Az eredményt egy külön végponton lehet lekérdezni a `task_id` segítségével.

---

## 1. Feladat Létrehozása

A kliens (PohiAIPro Backend) egy új feladatot küld az ügynökrendszernek.

- **Végpont:** `POST /api/agent-task`
- **Content-Type:** `application/json`

### Kérés (Request) Formátuma

```json
{
  "task_type": "string",
  "payload": {
    // A task_type-tól függő, tetszőleges JSON objektum
  }
}
```

- `task_type` (string, kötelező): Meghatározza, melyik ügynök-csoport fogja kezelni a feladatot. Lehetséges értékek:
  - `PLAN_LOGISTICS`: Logisztikai útvonal és rakodás tervezése.
  - `MATCH_DEMAND_STOCK`: Kereslet és kínálat párosítása.
  - `GENERATE_CONTENT`: Termékleírás, árjavaslat, stb. generálása.
  - `ANALYZE_DATA`: Adminisztrátori elemzések futtatása.
- `payload` (object, kötelező): A feladatspecifikus adatok.

### Válasz (Response) Formátuma

A szerver (BAS) azonnal válaszol egy `task_id`-val.

```json
{
  "task_id": "string"
}
```

- `task_id` (string): Egy egyedi azonosító, amellyel a feladat állapotára és eredményére lehet hivatkozni.

---

## 2. Feladat Állapotának Lekérdezése

A kliens lekérdezi egy korábban létrehozott feladat állapotát és (ha elkészült) eredményét.

- **Végpont:** `GET /api/agent-task-status/{task_id}`

### Válasz (Response) Formátuma

```json
{
  "task_id": "string",
  "status": "string",
  "result": {
    // A feladat eredménye, ha a státusz "COMPLETED"
  },
  "error": "string | null"
}
```

- `status` (string): A feladat aktuális állapota. Lehetséges értékek:
  - `PENDING`: A feladat várakozik a feldolgozásra.
  - `IN_PROGRESS`: A feladat jelenleg fut.
  - `COMPLETED`: A feladat sikeresen befejeződött.
  - `FAILED`: A feladat hibával leállt.
- `result` (object | null): Sikeres befejezés (`COMPLETED`) esetén tartalmazza a feladat kimenetét. A séma a `task_type`-tól függ.
- `error` (string | null): Hiba (`FAILED`) esetén tartalmazza a hibaüzenetet.

---

## Példa: Logisztikai Tervezés (`PLAN_LOGISTICS`)

### Kérés (`POST /api/agent-task`)

```json
{
  "task_type": "PLAN_LOGISTICS",
  "payload": {
    "deal_ids": ["deal-001", "deal-002", "deal-003"],
    "truck_capacity_kg": 24000
  }
}
```

### Eredmény (`result` objektum `COMPLETED` státusz esetén)

```json
{
  "optimized_route": [
    {
      "stop": 1,
      "location": "Budapest, HU",
      "deal_id": "deal-001",
      "action": "LOAD"
    },
    {
      "stop": 2,
      "location": "Vienna, AT",
      "deal_id": "deal-002",
      "action": "LOAD"
    },
    {
      "stop": 3,
      "location": "Munich, DE",
      "deal_id": "deal-003",
      "action": "UNLOAD_ALL"
    }
  ],
  "cmr_document_data": {
    "sender": "Pohi Corp.",
    "receiver": "Kunde GmbH",
    "cargo_description": "Acacia wood poles, 23500 kg",
    "vehicle_plate_number": "ABC-123"
  },
  "summary": "The 3 orders can be fulfilled with one 24-ton truck, making 3 stops. The total route is 850 km."
}
```
