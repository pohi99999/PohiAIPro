# GEMINI.md - Pohi AI Pro Project Context

Ez a dokumentum a `PohiAIPro` projekt kontextusát és technikai részleteit foglalja össze a Gemini AI asszisztens számára.

---

## 1. Project Overview

A Pohi AI Pro egy fejlett, valós idejű webalkalmazás, amely a Firebase platformra épül. A projekt célja, hogy intelligens, MI-alapú funkciókkal támogasson komplex üzleti folyamatokat, mint például a logisztikai tervezés, piaci elemzés és tartalomgenerálás.

### Core Technologies

*   **Frontend:** React (v18) with TypeScript, built with Vite.
*   **Backend:** Firebase Cloud Functions (Node.js v18, TypeScript).
*   **Database:** Firestore (NoSQL).
*   **Authentication:** Firebase Authentication.
*   **File Storage:** Firebase Storage.
*   **Data Services:** Firebase Data Connect.
*   **Testing:** Vitest and React Testing Library.
*   **AI/ML:** The project is transitioning from direct Google GenAI API calls to an agent-based architecture orchestrated by an external **BrunellaAgentSystem (BAS)**.

### Architecture

The current architecture is a typical Firebase web app. However, it's evolving towards a more sophisticated, agent-based model as defined in `API_CONTRACT.md` and `workflow.md`.

**New Proposed Architecture:**
`Frontend (React)` -> `PohiAIPro Backend (Firebase Functions as API Gateway)` -> `BrunellaAgentSystem (External Service)` -> `Specialized AI Agents`

The backend functions (`/functions` directory) serve as a bridge or API Gateway, forwarding complex tasks to the BAS.

---

## 2. Building and Running the Project

### Prerequisites

1.  **Node.js:** v18 is specified for backend functions.
2.  **Firebase CLI:** Required for deployment and emulator management.
3.  **Service Account:** A Firebase service account key (`.json`) is needed for local admin-level backend development. See `README.FIREBASE_SETUP.md`.

### Key Commands

Commands are run from the project root directory.

#### Frontend (Vite)

*   **Install Dependencies:**
    ```bash
    npm install
    ```
*   **Run Development Server:**
    ```bash
    npm run dev
    ```
*   **Build for Production:**
    ```bash
    npm run build
    ```
*   **Run Tests:**
    ```bash
    npm run test
    ```

#### Backend (Firebase Functions)

The backend functions are located in the `/functions` directory.

*   **Install Dependencies:**
    ```bash
    cd functions
    npm install
    ```
*   **Run Emulators:** To run the entire Firebase suite locally (Hosting, Functions, Firestore, etc.).
    ```bash
    firebase emulators:start
    ```
*   **Deploy Functions:**
    ```bash
    firebase deploy --only functions
    ```
    *Note: The `firebase.json` specifies a `python313` runtime, but this is incorrect. The active codebase is TypeScript/Node.js in the `functions/src` directory.*

---

## 3. Development Conventions

### Agent-Based Task Handling

As per `API_CONTRACT.md`, new AI features should follow an asynchronous, task-based pattern:
1.  The frontend calls a Firebase Function endpoint (e.g., `agentTask`).
2.  This function acts as a gateway, posting a job to the external BrunellaAgentSystem (BAS) and immediately returning a `task_id`.
3.  The frontend uses this `task_id` to poll another endpoint for the status (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`) and the final result.

### Key Agent Tasks (`task_type`)

*   `PLAN_LOGISTICS`: Route and truckload optimization.
*   `MATCH_DEMAND_STOCK`: Matching supply with demand.
*   `GENERATE_CONTENT`: Product descriptions, price suggestions.
*   `ANALYZE_DATA`: Running admin-level data analysis.

### Code Style & Quality

*   **Linting:** ESLint is configured for TypeScript/React. Run `npm run lint`.
*   **Formatting:** Prettier is used for code formatting. Run `npm run format`.
*   **Types:** The project uses TypeScript extensively. Global types can be found in `types.ts`.

### Important Files for Context

*   `firebase.json`: Defines the core Firebase services, emulator settings, and deployment rules.
*   `package.json`: Lists frontend dependencies and scripts.
*   `functions/package.json`: Lists backend (Cloud Functions) dependencies.
*   `functions/src/index.ts`: The main entry point for all Cloud Functions.
*   `API_CONTRACT.md`: **Crucial.** Defines the communication protocol between this project and the BrunellaAgentSystem.
*   `workflow.md`: **Crucial.** Outlines the strategic vision for evolving the project towards an agent-based architecture.
*   `dataconnect/`: Contains the schema and configuration for Firebase Data Connect.
