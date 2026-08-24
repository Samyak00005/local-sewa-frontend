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
  call npm install
  if errorlevel 1 goto :failed
)

call npm run build
if errorlevel 1 goto :failed

echo.
echo Build completed. Android-ready web files are inside the dist folder.
pause
exit /b 0

:failed
echo.
echo Build failed. Review the error shown above.
pause
exit /b 1
