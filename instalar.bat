@echo off
echo ========================================
echo    INSTALADOR DO SISTEMA DE RESTAURANTE
echo ========================================
echo.

echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado!

echo.
echo [2/6] Verificando PostgreSQL...
echo Por favor, certifique-se de que o PostgreSQL esta rodando na porta 5432
echo Se nao tiver instalado, baixe em: https://www.postgresql.org/download/
echo.
pause

echo.
echo [3/6] Configurando Backend...
cd restaurante-saas
if not exist node_modules (
    echo Instalando dependencias do backend...
    npm install
) else (
    echo ✅ Dependencias do backend ja instaladas
)

echo Configurando variaveis de ambiente...
if not exist .env (
    copy config.env .env
    echo ✅ Arquivo .env criado
) else (
    echo ✅ Arquivo .env ja existe
)

echo.
echo [4/6] Configurando Frontend...
cd ..\frontend-restaurante
if not exist node_modules (
    echo Instalando dependencias do frontend...
    npm install
) else (
    echo ✅ Dependencias do frontend ja instaladas
)

echo Configurando variaveis de ambiente...
if not exist .env.local (
    copy env.example .env.local
    echo ✅ Arquivo .env.local criado
) else (
    echo ✅ Arquivo .env.local ja existe
)

echo.
echo [5/6] Verificando banco de dados...
echo Por favor, execute o seguinte no PostgreSQL:
echo.
echo CREATE DATABASE restaurante_saas;
echo \c restaurante_saas
echo -- Cole o conteudo do arquivo database/schema.sql
echo.
pause

echo.
echo [6/6] Instalacao concluida!
echo.
echo ========================================
echo    COMO EXECUTAR O SISTEMA
echo ========================================
echo.
echo 1. Inicie o Backend:
echo    cd restaurante-saas
echo    npm run dev
echo.
echo 2. Em outro terminal, inicie o Frontend:
echo    cd frontend-restaurante
echo    npm run dev
echo.
echo 3. Acesse:
echo    - Cliente: http://localhost:3000/mesa/1
echo    - Admin: http://localhost:3000/admin
echo.
echo ========================================
pause
