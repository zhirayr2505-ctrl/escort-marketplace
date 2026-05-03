# Запуск из корня репозитория. Перед первым push: создай репо на GitHub и PAT (Settings → Developer → Tokens).
$git = "C:\Program Files\Git\bin\git.exe"
if (-not (Test-Path $git)) {
    Write-Error "Git не найден по пути $git — переустанови Git for Windows."
    exit 1
}
Set-Location (Split-Path -Parent $PSScriptRoot)
& $git push -u origin main
