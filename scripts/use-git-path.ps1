# Добавить Git в PATH на время этого окна PowerShell (если команда git «не найдена»)
$g = "C:\Program Files\Git\bin"
if (Test-Path $g) {
    $env:Path = "$g;$env:Path"
    Write-Host "OK: git в PATH для этого терминала. Проверка:"
    git --version
} else {
    Write-Host "Установи Git: https://git-scm.com/download/win"
}
