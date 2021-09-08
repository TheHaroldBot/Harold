@ECHO OFF
:START
node index.js
timeout /NOBREAK /t 10
GOTO START