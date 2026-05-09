@echo off
title Student Management System Launcher
color 0A

echo.
echo  ==========================================
echo   Student Management System - Starting...
echo  ==========================================
echo.

:: Kill anything on port 5147
echo  [1/4] Freeing port 5147...
taskkill /IM StudentManagement.exe /F >nul 2>&1
ping -n 2 127.0.0.1 >nul

:: Start LocalDB
echo  [2/4] Starting SQL LocalDB...
sqllocaldb start MSSQLLocalDB >nul 2>&1

:: Start API - cd into publish_out so appsettings.json is found
echo  [3/4] Starting API on http://localhost:5147 ...
start "API Server" cmd /k "cd /d "%~dp0StudentManagement\publish_out" && dotnet StudentManagement.dll --urls http://localhost:5147"

:: Wait then start React UI
echo  [4/4] Waiting 8s then starting React UI...
ping -n 9 127.0.0.1 >nul
start "React UI" cmd /k "cd /d "%~dp0student-ui" && npm run dev"

ping -n 6 127.0.0.1 >nul
echo.
echo  ==========================================
echo   API  : http://localhost:5147/swagger
echo   UI   : http://localhost:5173
echo   Login: admin / Admin@123
echo  ==========================================
echo.
start http://localhost:5173
