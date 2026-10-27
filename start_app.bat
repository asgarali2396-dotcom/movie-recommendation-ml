@echo off
title CineMatch ML - Movie Recommendation System
color 0A
echo ==============================================================
echo   CineMatch ML - Movie Recommendation System (PWA)
echo   Machine Learning Engine (Genre, Duration, Rating)
echo ==============================================================
echo.
echo Starting Python HTTP Server on port 3000...
start "" http://localhost:3000
python server.py
pause
