param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Script,
  [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
  [string[]]$ScriptArgs
)

$ErrorActionPreference = "Stop"
$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
  & $python.Source $Script @ScriptArgs
  exit $LASTEXITCODE
}

$py = Get-Command py -ErrorAction SilentlyContinue
if ($py) {
  & $py.Source -3 $Script @ScriptArgs
  exit $LASTEXITCODE
}

$runtimeRoot = Join-Path $env:USERPROFILE ".cache\codex-runtimes"
$bundled = Get-ChildItem -Path $runtimeRoot -Recurse -Filter python.exe -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -match "dependencies\\python\\python\.exe$" } |
  Select-Object -First 1

if (-not $bundled) {
  throw "Python 3 was not found. Install Python or run this repository through Codex's bundled workspace runtime."
}

& $bundled.FullName $Script @ScriptArgs
exit $LASTEXITCODE
