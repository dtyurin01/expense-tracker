[CmdletBinding()]
param(
  [Parameter(Mandatory = $false)]
  [string] $FilePath = "src/api/expense-tracker.postman_collection.json",

  [Parameter(Mandatory = $false)]
  [string] $CollectionUid = $env:POSTMAN_COLLECTION_UID,

  [Parameter(Mandatory = $false)]
  [string] $WorkspaceId = $env:POSTMAN_WORKSPACE_ID,

  [Parameter(Mandatory = $false)]
  [string] $ApiKey = $env:POSTMAN_API_KEY,

  [Parameter(Mandatory = $false)]
  [switch] $ListWorkspaces,

  [Parameter(Mandatory = $false)]
  [switch] $ListCollections
)

$ErrorActionPreference = "Stop"

function Assert-NotNullOrWhiteSpace([string]$Value, [string]$Name) {
  if ([string]::IsNullOrWhiteSpace($Value)) {
    throw "$Name is required. Provide -$Name or set the corresponding env var."
  }
}

function Write-Info([string]$Message) {
  Write-Host "[sync-postman] $Message"
}

Assert-NotNullOrWhiteSpace -Value $ApiKey -Name "ApiKey"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

if (-not [System.IO.Path]::IsPathRooted($FilePath)) {
  $FilePath = Join-Path $repoRoot $FilePath
}

$headers = @{ "X-Api-Key" = $ApiKey; "Content-Type" = "application/json" }

function List-Workspaces {
  $uri = "https://api.getpostman.com/workspaces"
  Write-Info "Listing workspaces"
  $resp = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
  if (-not $resp.workspaces) {
    Write-Info "No workspaces returned."
    return
  }
  $resp.workspaces | Select-Object name, id, type | Format-Table -AutoSize
}

function List-Collections([string]$WsId) {
  $baseUri = "https://api.getpostman.com/collections"
  $uri = $baseUri
  $ws = $WsId
  if (-not [string]::IsNullOrWhiteSpace($ws)) {
    $ws = $ws.Trim()
    $wsEscaped = [System.Uri]::EscapeDataString($ws)
    $uri = "${baseUri}?workspace=$wsEscaped"
  }

  if (-not [string]::IsNullOrWhiteSpace($ws)) {
    Write-Info "Listing collections (workspace=$ws)"
  } else {
    Write-Info "Listing collections"
  }
  $resp = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
  if (-not $resp.collections) {
    Write-Info "No collections returned."
    return
  }
  $resp.collections | Select-Object name, uid | Format-Table -AutoSize
}

if ($ListWorkspaces) {
  List-Workspaces
  return
}

if ($ListCollections) {
  List-Collections -WsId $WorkspaceId
  return
}

if (-not (Test-Path -LiteralPath $FilePath)) {
  throw "File not found: $FilePath"
}

# Common misconfig: users sometimes paste a Workspace ID into POSTMAN_COLLECTION_UID.
# Workspace IDs commonly include the substring "Workspace~".
if (-not [string]::IsNullOrWhiteSpace($CollectionUid) -and $CollectionUid -like "*Workspace~*" -and [string]::IsNullOrWhiteSpace($WorkspaceId)) {
  Write-Info "POSTMAN_COLLECTION_UID looks like a Workspace ID. Treating it as POSTMAN_WORKSPACE_ID and creating a new collection."
  $WorkspaceId = $CollectionUid
  $CollectionUid = $null
}

Write-Info "Reading collection from '$FilePath'"
$rawJson = Get-Content -LiteralPath $FilePath -Raw
$collection = $rawJson | ConvertFrom-Json

if ($null -eq $collection.info -or [string]::IsNullOrWhiteSpace($collection.info.schema)) {
  throw "Invalid Postman collection: missing info.schema"
}

function Update-Collection([string]$Uid, $CollectionObject) {
  $uri = "https://api.getpostman.com/collections/$Uid"
  $payload = @{ collection = $CollectionObject } | ConvertTo-Json -Depth 100

  Write-Info "Updating collection UID: $Uid"
  try {
    $resp = Invoke-RestMethod -Method Put -Uri $uri -Headers $headers -Body $payload
  } catch {
    $message = $_.Exception.Message
    if ($message -match 'instanceNotFoundError' -and $message -match 'collection') {
      throw "Collection not found for UID '$Uid'. Ensure POSTMAN_COLLECTION_UID is a *collection* UID (not a workspace ID). To create a new collection, unset POSTMAN_COLLECTION_UID and set POSTMAN_WORKSPACE_ID. Raw error: $message"
    }
    throw
  }

  if ($resp.collection -and $resp.collection.uid) {
    Write-Info "Updated OK. uid=$($resp.collection.uid) name=$($resp.collection.name)"
  } else {
    Write-Info "Updated OK."
  }
}

function Create-Collection([string]$WsId, $CollectionObject) {
  $uri = "https://api.getpostman.com/collections?workspace=$WsId"
  $payload = @{ collection = $CollectionObject } | ConvertTo-Json -Depth 100

  Write-Info "Creating collection in workspace: $WsId"
  try {
    $resp = Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $payload
  } catch {
    $message = $_.Exception.Message
    if ($message -match 'forbiddenError') {
      throw "Forbidden creating collection in workspace '$WsId'. The API key user likely doesn't have write access, or the Workspace ID is wrong. Try: powershell -ExecutionPolicy Bypass -File scripts/run-sync-postman.ps1 -ListWorkspaces, then set POSTMAN_WORKSPACE_ID to an accessible workspace ID. Raw error: $message"
    }
    throw
  }

  if (-not ($resp.collection -and $resp.collection.uid)) {
    throw "Create succeeded but response did not include collection.uid"
  }

  $uid = [string]$resp.collection.uid
  Write-Info "Created OK. uid=$uid name=$($resp.collection.name)"
  Write-Info "Set POSTMAN_COLLECTION_UID=$uid for future updates."

  return $uid
}

if ([string]::IsNullOrWhiteSpace($CollectionUid)) {
  if ([string]::IsNullOrWhiteSpace($WorkspaceId)) {
    throw "POSTMAN_COLLECTION_UID is not set. Either set POSTMAN_COLLECTION_UID (existing collection) or POSTMAN_WORKSPACE_ID to create one."
  }

  $CollectionUid = Create-Collection -WsId $WorkspaceId -CollectionObject $collection
}

Update-Collection -Uid $CollectionUid -CollectionObject $collection

Write-Info "Done. If you're logged in to Postman Desktop with sync enabled, the collection should update automatically."
