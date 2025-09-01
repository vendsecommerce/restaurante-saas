# Script de build para o Netlify (Windows PowerShell)
Write-Host "🚀 Iniciando build para o Netlify..." -ForegroundColor Green

# Navegar para o frontend
Set-Location frontend-restaurante

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# Fazer build
Write-Host "🔨 Fazendo build..." -ForegroundColor Yellow
npm run build

# Voltar para a raiz
Set-Location ..

# Verificar se a pasta public foi criada na raiz
if (Test-Path "public") {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    Write-Host "📁 Pasta public criada em: $(Get-Location)\public" -ForegroundColor Green
    Write-Host "📄 Arquivos gerados:" -ForegroundColor Cyan
    Get-ChildItem public | Format-Table Name, Length, LastWriteTime
} else {
    Write-Host "❌ Erro: Pasta public não foi criada na raiz!" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Build finalizado!" -ForegroundColor Green
