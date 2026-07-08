@echo off
chcp 65001 >nul
echo ========================================
echo     暖心助手 - 启动程序
echo ========================================
echo.
echo 正在启动暖心助手...
echo.

if exist "%~dp0resources\node_modules\electron\cli.js" (
  node "%~dp0resources\node_modules\electron\cli.js" "%~dp0"
) else (
  echo 首次运行，正在安装Electron环境...
  echo.
  
  cd /d "%~dp0resources"
  
  if not exist package.json (
    echo {
    echo   "name": "warm-heart-app",
    echo   "version": "1.0.0",
    echo   "main": "main.js",
    echo   "dependencies": {
    echo     "electron": "^43.0.0"
    echo   }
    echo } > package.json
  )
  
  npm install --legacy-peer-deps
  
  if %errorlevel% equ 0 (
    echo.
    echo 安装成功！正在启动...
    node "%~dp0resources\node_modules\electron\cli.js" "%~dp0"
  ) else (
    echo.
    echo 安装失败，请手动安装Node.js后重试
    echo Node.js下载地址: https://nodejs.org/
    pause
  )
)

pause