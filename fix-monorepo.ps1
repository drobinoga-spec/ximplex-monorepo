# ============================================
# FIX: Sincronizar node_modules en packages
# ============================================

Set-Location "C:\Users\drobi\Projects\ximplex-monorepo"

Write-Host "=== Limpiando node_modules en packages ===" -ForegroundColor Yellow
Remove-Item -Recurse -Force "C:\Users\drobi\Projects\ximplex-monorepo\packages\formix\node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "C:\Users\drobi\Projects\ximplex-monorepo\packages\ximplex-web\node_modules" -ErrorAction SilentlyContinue

Write-Host "✓ Limpiezas completadas"
Write-Host ""

Write-Host "=== npm install GLOBAL (desde raíz) ===" -ForegroundColor Green
npm install --workspaces

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install --workspaces falló" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Monorepo sincronizado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora intenta: npm run dev" -ForegroundColor Cyan
Read-Host "Presiona ENTER para cerrar"
