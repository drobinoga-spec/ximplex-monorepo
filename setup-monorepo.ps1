# ============================================
# XIMPLEX MONOREPO SETUP SCRIPT
# ============================================
# Este script hace todo el setup automático
# Ejecuta con: PowerShell -ExecutionPolicy Bypass -File setup-monorepo.ps1

Set-Location "C:\Users\drobi\Projects\ximplex-monorepo"

Write-Host "=== PASITO 1: npm install ===" -ForegroundColor Green
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install falló" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== PASITO 2: npm run type-check ===" -ForegroundColor Green
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  type-check encontró errores (esto puede ser normal)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== PASITO 3: Build formix ===" -ForegroundColor Green
cd "C:\Users\drobi\Projects\ximplex-monorepo\packages\formix"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ formix build falló" -ForegroundColor Red
    cd "C:\Users\drobi\Projects\ximplex-monorepo"
    exit 1
}

Write-Host ""
Write-Host "=== PASITO 4: Build ximplex-web ===" -ForegroundColor Green
cd "C:\Users\drobi\Projects\ximplex-monorepo\packages\ximplex-web"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ximplex-web build falló" -ForegroundColor Red
    cd "C:\Users\drobi\Projects\ximplex-monorepo"
    exit 1
}

cd "C:\Users\drobi\Projects\ximplex-monorepo"
Write-Host ""
Write-Host "✅ Setup completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximo paso: Ejecutar 'npm run dev' para levantar los servidores" -ForegroundColor Cyan
Read-Host "Presiona ENTER para cerrar"
