# sync-postman

Syncs the local Postman collection JSON in this repo to Postman Cloud via the Postman API.

Why: Postman Desktop does not auto-watch a local `.json` file after import. If you update the collection in Postman Cloud, Desktop will sync it automatically (when you're signed in).

## Requirements

- Postman API key (create in Postman: Settings → API keys)
- A collection UID to update (`POSTMAN_COLLECTION_UID`), or a workspace id to create a new collection (`POSTMAN_WORKSPACE_ID`)

## Usage (PowerShell)

From repo root:

1) Create `.env.postman` from `.env.postman.example` and fill values.

2) Run the wrapper (recommended):

```powershell
./scripts/run-sync-postman.ps1
```

Or, run the sync script directly (requires env vars already set in the shell):

```powershell
$env:POSTMAN_API_KEY = "<your_api_key>"
$env:POSTMAN_COLLECTION_UID = "<your_collection_uid>"   # recommended
# or: $env:POSTMAN_WORKSPACE_ID = "<your_workspace_id>" # to create on first run

./scripts/sync-postman.ps1 -FilePath "src/api/expense-tracker.postman_collection.json"
```

If you omit `-FilePath`, it defaults to `src/api/expense-tracker.postman_collection.json`.

## Notes

- Never commit API keys.
- After a successful sync, ensure you’re signed into the same Postman account in Postman Desktop and sync is enabled.
