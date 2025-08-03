@echo off
echo.
echo ============================================
echo    NOTEST - Frontend & Backend Launcher
echo ============================================
echo.

REM Ana dizine git
cd /d "%~dp0"

echo [1/6] Checking dependencies...
echo.

REM Backend bağımlılıklarını kontrol et
echo [2/6] Installing Backend dependencies...
cd Backend
if not exist node_modules (
    echo Installing Backend node_modules...
    call npm install
) else (
    echo Backend dependencies already installed.
)

REM Frontend bağımlılıklarını kontrol et  
echo.
echo [3/6] Installing Frontend dependencies...
cd ..\Frontend
if not exist node_modules (
    echo Installing Frontend node_modules...
    call npm install
) else (
    echo Frontend dependencies already installed.
)

cd ..

echo.
echo [4/6] Starting Backend Server...
start "Backend Server" cmd /k "cd /d %CD%\Backend && echo Starting Backend on Port 5001... && npm run dev"

REM Backend'in başlaması için 3 saniye bekle
timeout /t 3 /nobreak >nul

echo.
echo [5/6] Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %CD%\Frontend && echo Starting Frontend on Port 5173... && npm run dev"

echo.
echo [6/6] Done! Opening browser...
echo.
echo ============================================
echo   NOTEST Servers Started Successfully!
echo ============================================
echo.
echo   Backend:  http://localhost:5001
echo   Frontend: http://localhost:5173
echo.
echo   Press any key to close this window...
echo ============================================

REM 5 saniye bekleyip tarayıcıyı aç
timeout /t 5 /nobreak >nul
start http://localhost:5173

pause >nul