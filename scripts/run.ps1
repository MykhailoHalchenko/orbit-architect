[CmdletBinding()]
param(
    [ValidateSet("desktop", "web", "build", "test")]
    [string]$Target = "desktop"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Assert-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found in PATH."
    }
}

function Invoke-Npm([string[]]$Arguments) {
    Assert-Command "npm.cmd"
    Push-Location (Join-Path $root "crates\web")
    try {
        & npm.cmd @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "npm command failed with exit code $LASTEXITCODE."
        }
    } finally {
        Pop-Location
    }
}

switch ($Target) {
    "desktop" {
        Assert-Command "cargo"
        & cargo run -p orbit-desktop
        if ($LASTEXITCODE -ne 0) {
            throw "cargo run failed with exit code $LASTEXITCODE."
        }
    }
    "web" {
        Invoke-Npm @("install")
        Invoke-Npm @("run", "dev", "--", "--host")
    }
    "build" {
        Assert-Command "cargo"
        & cargo build --workspace
        if ($LASTEXITCODE -ne 0) {
            throw "cargo build failed with exit code $LASTEXITCODE."
        }
        Invoke-Npm @("install")
        Invoke-Npm @("run", "build")
    }
    "test" {
        Assert-Command "cargo"
        & cargo test --workspace
        if ($LASTEXITCODE -ne 0) {
            throw "cargo test failed with exit code $LASTEXITCODE."
        }
    }
}
