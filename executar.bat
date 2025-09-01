@echo off
echo ========================================
echo    EXECUTANDO SISTEMA DE RESTAURANTE
echo ========================================
echo.

echo Iniciando Backend e Frontend...
echo.

echo [1/2] Iniciando Backend na porta 4000...
start "Backend - Restaurante" cmd /k "cd restaurante-saas && npm run dev"

echo Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Frontend na porta 3000...
start "Frontend - Restaurante" cmd /k "cd frontend-restaurante && npm run dev"

echo.
echo ========================================
echo    SISTEMA INICIADO!
echo ========================================
echo.
echo Aguarde alguns segundos e acesse:
echo.
echo 🍽️  Página do Cliente: http://localhost:3000/mesa/1
echo 👨‍💼 Painel Admin: http://localhost:3000/admin
echo.
echo Para parar os servidores, feche as janelas do terminal
echo.
echo ========================================
pause
