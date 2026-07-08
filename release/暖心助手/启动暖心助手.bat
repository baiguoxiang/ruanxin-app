@echo off
cd /d "%~dp0resources/app"
node node_modules/electron/cli.js .
pause