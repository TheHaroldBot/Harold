@ECHO OFF
:START
git pull
node --max-old-space-size=4096 index.js
timeout /NOBREAK /t 5
GOTO START