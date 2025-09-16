/*
  Paste this snippet into the browser console while the app is open (on any page of the app).
  It will collect known localStorage keys used by the app and trigger a download of a JSON file
  named `pohi-localstorage-export-<timestamp>.json`.

  After download, move the file into the repository's `exports/` folder (create it if needed),
  then run the migration script in the repo root:

    node .\scripts\migrate-data.js --dry-run

  Then run without --dry-run to commit.
*/
(function exportPohiLocalStorage() {
  const keys = [
    "pohi-ai-customer-demands",
    "pohi-ai-manufacturer-stock",
    "pohi-ai-mock-companies",
    "pohi-ai-confirmed-matches",
    "pohi-ai-match-interests",
    "pohi-ai-conversations",
    "pohi-ai-messages",
    "pohi-ai-deals",
    "pohi-ai-shipments",
    "pohi-ai-invoices",
    "pohi-ai-feedback",
    "pohi-ai-notifications",
  ];

  const out = {};
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v !== null) {
      try {
        out[k] = JSON.parse(v);
      } catch (e) {
        out[k] = v;
      }
    }
  }

  // If nothing found, offer to export all localStorage
  const hasAny = Object.keys(out).length > 0;
  if (!hasAny) {
    if (
      !confirm(
        "No known Pohi localStorage keys found. Export ALL localStorage items instead?",
      )
    )
      return;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      try {
        out[k] = JSON.parse(localStorage.getItem(k));
      } catch (e) {
        out[k] = localStorage.getItem(k);
      }
    }
  }

  const blob = new Blob([JSON.stringify(out, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  a.download = `pohi-localstorage-export-${ts}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  console.log("Exported localStorage keys:", Object.keys(out));
})();
