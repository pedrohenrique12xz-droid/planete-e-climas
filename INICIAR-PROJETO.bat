@echo off
set "ROOT=%~dp0"
start "Planeta e Clima - API" cmd /k "cd /d ""%ROOT%backend"" && npm run dev"
timeout /t 2 /nobreak >nul
start "Planeta e Clima - React" cmd /k "cd /d ""%ROOT%"" && npm run dev"
echo API e React iniciados em janelas separadas.
echo Abra http://localhost:5173 no navegador.
