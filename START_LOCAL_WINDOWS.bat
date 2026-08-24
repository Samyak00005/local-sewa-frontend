@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the Node.js LTS version first.
  echo Download: https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing frontend packages. This is required only the first time...
  call npm install
  if errorlevel 1 goto :failed
)

echo.
echo Starting Local Sewa V10 React frontend...
echo The browser URL will normally be http://localhost:5173
echo Keep this window open while using the local website.
echo.
call npm run dev
exit /b %errorlevel%

:failed
echo.
echo Setup failed. Check your internet connection and run this file again.
pause
exit /b 1
