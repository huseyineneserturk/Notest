@echo off
echo.
echo ============================================
echo      NOTEST - Environment Setup
echo ============================================
echo.

REM Ana dizine git
cd /d "%~dp0"

echo [1/3] Setting up Backend .env file...

REM Backend .env dosyasını oluştur
echo # Server Configuration > "Backend\.env"
echo PORT=5001 >> "Backend\.env"
echo NODE_ENV=development >> "Backend\.env"
echo. >> "Backend\.env"
echo # Supabase Configuration >> "Backend\.env"
echo SUPABASE_URL=your-supabase-project-url >> "Backend\.env"
echo SUPABASE_ANON_KEY=your-supabase-anon-key >> "Backend\.env"
echo SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key >> "Backend\.env"
echo. >> "Backend\.env"
echo # JWT Configuration >> "Backend\.env"
echo JWT_SECRET=notest-super-secret-jwt-key-2024-change-in-production >> "Backend\.env"
echo JWT_EXPIRE=7d >> "Backend\.env"
echo. >> "Backend\.env"
echo # Google AI (Gemini) Configuration >> "Backend\.env"
echo GOOGLE_AI_API_KEY=your-google-ai-api-key >> "Backend\.env"
echo. >> "Backend\.env"
echo # CORS Configuration >> "Backend\.env"
echo CORS_ORIGIN=http://localhost:5173 >> "Backend\.env"
echo. >> "Backend\.env"
echo # Rate Limiting >> "Backend\.env"
echo RATE_LIMIT_WINDOW_MS=900000 >> "Backend\.env"
echo RATE_LIMIT_MAX_REQUESTS=100 >> "Backend\.env"

echo ✓ Backend .env file created with PORT=5001

echo.
echo [2/3] Setting up Frontend .env file...

REM Frontend .env dosyasını oluştur
echo VITE_API_URL=http://localhost:5001/api > "Frontend\.env"

echo ✓ Frontend .env file created with VITE_API_URL=http://localhost:5001/api

echo.
echo [3/3] Environment setup complete!
echo.
echo ============================================
echo          Configuration Summary
echo ============================================
echo.
echo Backend Configuration:
echo   - Port: 5001
echo   - CORS: http://localhost:5173
echo   - Environment: development
echo.
echo Frontend Configuration:
echo   - API URL: http://localhost:5001/api
echo   - Frontend will run on: http://localhost:5173
echo.
echo ============================================
echo    Ready to start! Run start.bat now.
echo ============================================
echo.
pause