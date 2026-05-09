@echo off
echo Stopping Student Management System...

echo [1/2] Killing API processes...
taskkill /IM StudentManagement.exe /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5147 " 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo [2/2] Killing React UI processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 " 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo All servers stopped.
timeout /t 2 /nobreak >nul
