@echo off
title Connecty Web App - Dev Run

:MAIN
cls
echo.
echo  - Starting client/ ...
start cmd /k "cd client/ && npm start"
echo.
echo  - Starting server/ ...
start cmd /k "cd server/ && npm start"
echo.