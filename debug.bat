@echo off
echo.
echo ============================================
echo        NOTEST - Debug Information
echo ============================================
echo.

REM Ana dizine git
cd /d "%~dp0"

echo [1] Checking Node.js and npm versions...
echo Node.js Version:
node --version
echo npm Version:
npm --version
echo.

echo [2] Checking Backend .env file...
if exist "Backend\.env" (
    echo ✓ Backend .env file exists
) else (
    echo ✗ Backend .env file missing!
    echo Copying from env.example...
    copy "Backend\env.example" "Backend\.env"
)
echo.

echo [3] Checking Frontend .env file...
if exist "Frontend\.env" (
    echo ✓ Frontend .env file exists
) else (
    echo ✗ Frontend .env file missing!
    echo Creating Frontend .env file...
    echo VITE_API_URL=http://localhost:5001/api > "Frontend\.env"
)
echo.

echo [4] Checking ports...
echo Checking if port 5001 is available...
netstat -an | findstr ":5001" >nul
if errorlevel 1 (
    echo ✓ Port 5001 is available
) else (
    echo ✗ Port 5001 is in use!
    netstat -an | findstr ":5001"
)

echo Checking if port 5173 is available...
netstat -an | findstr ":5173" >nul
if errorlevel 1 (
    echo ✓ Port 5173 is available
) else (
    echo ✗ Port 5173 is in use!
    netstat -an | findstr ":5173"
)
echo.

echo [5] Testing Backend Dependencies...
cd Backend
echo Backend dependencies:
npm list --depth=0 2>nul | findstr -v "npm WARN"
cd ..
echo.

echo [6] Testing Frontend Dependencies...
cd Frontend  
echo Frontend dependencies:
npm list --depth=0 2>nul | findstr -v "npm WARN"
cd ..
echo.

echo ============================================
echo            Debug Complete!
echo ============================================
echo.
pause