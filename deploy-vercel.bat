@echo off
echo ========================================
echo    DEPLOY NO VERCEL - SISTEMA RESTAURANTE
echo ========================================
echo.

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado!
    echo Por favor, instale o Node.js primeiro
    pause
    exit /b 1
)
echo ✅ Node.js encontrado!

echo.
echo [2/5] Verificando Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando Vercel CLI...
    npm install -g vercel
) else (
    echo ✅ Vercel CLI encontrado!
)

echo.
echo [3/5] Configurando Backend...
if not exist api (
    echo Criando pasta api...
    mkdir api
)

echo Copiando arquivos do backend...
copy api\index.js api\index.js >nul 2>&1
copy api\package.json api\package.json >nul 2>&1

echo.
echo [4/5] Deploy do Backend...
cd api
echo.
echo ⚠️  IMPORTANTE: Configure as variaveis de ambiente no Vercel:
echo    - DATABASE_URL (URL do seu PostgreSQL)
echo    - FRONTEND_URL (URL do seu frontend)
echo    - NODE_ENV=production
echo.
pause

echo Fazendo deploy do backend...
vercel --prod

echo.
echo [5/5] Deploy do Frontend...
cd ..\frontend-restaurante

echo ⚠️  IMPORTANTE: Configure as variaveis de ambiente no Vercel:
echo    - NEXT_PUBLIC_API_URL (URL do seu backend)
echo    - NEXT_PUBLIC_SOCKET_URL (URL do seu backend)
echo.
pause

echo Fazendo deploy do frontend...
vercel --prod

echo.
echo ========================================
echo    DEPLOY CONCLUIDO!
echo ========================================
echo.
echo 🌐 URLs do seu sistema:
echo    - Frontend: https://seu-projeto.vercel.app
echo    - Backend: https://seu-api.vercel.app
echo    - Cliente: https://seu-projeto.vercel.app/mesa/1
echo    - Admin: https://seu-projeto.vercel.app/admin
echo.
echo 📋 Próximos passos:
echo    1. Configure o banco de dados (Supabase/Neon)
echo    2. Configure as variáveis de ambiente no Vercel
echo    3. Teste o sistema
echo.
echo ========================================
pause
