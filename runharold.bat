@ECHO OFF
:START
git pull
node --max-old-space-size=4096 index.js
timeout /NOBREAK /t 10
GOTO START