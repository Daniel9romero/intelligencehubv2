@echo off
echo ========================================
echo   BAFAR Intelligence Hub - Servidor Local
echo ========================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python encontrado. Iniciando servidor...
    echo.
    echo 🌐 URL: http://localhost:8080
    echo 📱 Red local: http://%COMPUTERNAME%:8080
    echo.
    echo ⚠️  IMPORTANTE: Compartir la URL de red local con el equipo
    echo.
    echo 🛑 Para detener: Presiona Ctrl+C
    echo ========================================
    echo.
    python -m http.server 8080
) else (
    echo ❌ Python no encontrado.
    echo.
    echo 📥 Descargar Python desde: https://python.org
    echo 💡 O usar Node.js: npx serve . -p 8080
    echo.
    pause
)