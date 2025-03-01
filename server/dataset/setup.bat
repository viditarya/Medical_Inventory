@echo off

REM Create the datasets directory structure
mkdir "data\delhi\raw" 2>nul
mkdir "data\delhi\processed" 2>nul
mkdir "data\kolkata\raw" 2>nul
mkdir "data\kolkata\processed" 2>nul

REM Check if .env exists, if not create it
if not exist ".env" (
    echo Creating .env file...
    echo DB_USERNAME=postgres> .env
    echo DB_PASSWORD=your_password>> .env
    echo DB_HOST=localhost>> .env
    echo DB_PORT=5432>> .env
)

REM Initialize the databases
psql -U postgres -f init_db.sql

REM Generate and load the data
python generate_data.py

echo Dataset setup complete!
pause
