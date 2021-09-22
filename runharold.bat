@ECHO OFF
:START
git pull
node index.js
timeout /NOBREAK /t 10
GOTO START