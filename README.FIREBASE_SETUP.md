Firebase local dev setup

1. Create or download a Firebase service account JSON from Google Cloud Console (IAM -> Service accounts -> Create key). Save it locally, e.g. `C:\Users\you\.config\pohi-firebase-sa.json`.

2. In PowerShell (temporary for current session):

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\Users\you\.config\pohi-firebase-sa.json'
```

Or persist for your user (Windows):

```powershell
[Environment]::SetEnvironmentVariable('GOOGLE_APPLICATION_CREDENTIALS','C:\Users\you\.config\pohi-firebase-sa.json','User')
```

3. Install dependencies if not present (from repo root):

```powershell
npm install
```

4. Check admin SDK connectivity:

```powershell
node .\scripts\check-firebase-admin.js
```

5. If the check passes, run the dry-run migration first (safe):

```powershell
node .\scripts\migrate-data.js --dry-run
```

6. If the dry-run looks correct, run the real migration:

```powershell
node .\scripts\migrate-data.js
```

Security note: do not commit the service account JSON to source control.
