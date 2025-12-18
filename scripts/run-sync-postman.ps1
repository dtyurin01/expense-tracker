[CmdletBinding()]
param(
  [Parameter(Mandatory = $false)]
  [string] $EnvFilePath,

  [Parameter(Mandatory = $false)]
  [string] $FilePath,

  [Parameter(Mandatory = $false)]
  [string] $WorkspaceId,

  [Parameter(Mandatory = $false)]
  [string] $CollectionUid,

  [Parameter(Mandatory = $false)]
  [string] $ApiKey,

  [Parameter(Mandatory = $false)]
  [switch] $ListWorkspaces,

  [Parameter(Mandatory = $false)]
  [switch] $ListCollections
)

$ErrorActionPreference = "Stop"

function Write-Info([string]$Message) {
  Write-Host "[run-sync-postman] $Message"
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

if ([string]::IsNullOrWhiteSpace($EnvFilePath)) {
  $EnvFilePath = Join-Path $repoRoot ".env.postman"
}

if (-not (Test-Path -LiteralPath $EnvFilePath)) {
  throw "Env file not found: $EnvFilePath. Create it from $(Join-Path $repoRoot '.env.postman.example')."
}

Write-Info "Loading env vars from '$EnvFilePath'"
Get-Content -LiteralPath $EnvFilePath | ForEach-Object {
  $line = $_.Trim()
  if ($line.Length -eq 0) { return }
  if ($line.StartsWith('#')) { return }

  $parts = $line -split '=', 2
  if ($parts.Count -ne 2) { return }

  $key = $parts[0].Trim()
  $value = $parts[1].Trim()

  # trim optional surrounding quotes
  if ($value.StartsWith('"') -and $value.EndsWith('"')) {
    $value = $value.Substring(1, $value.Length - 2)
  }

  if (-not [string]::IsNullOrWhiteSpace($key)) {
    Set-Item -Path "env:$key" -Value $value
  }
}

if ([string]::IsNullOrWhiteSpace($FilePath)) {
  $FilePath = $env:POSTMAN_COLLECTION_FILE
}

$scriptPath = Join-Path $PSScriptRoot "sync-postman.ps1"

Write-Info "Running sync script ($scriptPath)"

$splat = @{}
if ($ListWorkspaces) { $splat["ListWorkspaces"] = $true }
if ($ListCollections) { $splat["ListCollections"] = $true }
if (-not [string]::IsNullOrWhiteSpace($FilePath)) { $splat["FilePath"] = $FilePath }
if (-not [string]::IsNullOrWhiteSpace($WorkspaceId)) { $splat["WorkspaceId"] = $WorkspaceId }
if (-not [string]::IsNullOrWhiteSpace($CollectionUid)) { $splat["CollectionUid"] = $CollectionUid }
if (-not [string]::IsNullOrWhiteSpace($ApiKey)) { $splat["ApiKey"] = $ApiKey }

& $scriptPath @splat
