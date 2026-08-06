# Installs project git hooks (strips Cursor co-author lines from commits).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$source = Join-Path $root ".githooks\prepare-commit-msg"
$hooksDir = Join-Path $root ".git\hooks"
$target = Join-Path $hooksDir "prepare-commit-msg"

if (-not (Test-Path (Join-Path $root ".git"))) {
  Write-Error "Not a git repository: $root"
}

New-Item -ItemType Directory -Force -Path $hooksDir | Out-Null
Copy-Item -Force $source $target
Write-Host "Installed prepare-commit-msg hook -> .git/hooks/prepare-commit-msg"
