@echo off
echo ===================================================
echo THUC THI MIGRATION VA UPDATE DATABASE TOAN HE THONG
echo ===================================================

:: Danh sach cac API co chua Database
set "projects=Identity.API Movie.API Facility.API Cast.API Schedule.API Booking.API"

for %%p in (%projects%) do (
    echo.
    echo ---------------------------------------------------
    echo Dang xu ly tien trinh EF Core cho: %%p
    echo ---------------------------------------------------
    cd Backend\%%p
    
    :: Tao file Migration 
    echo [1/2] Generating Migration...
    dotnet ef migrations add InitialSetup
    
    :: Day schema xuong Database
    echo [2/2] Updating Database...
    dotnet ef database update
    
    cd ..\..
)

echo.
echo ===================================================
echo HOAN TAT TOAN BO TIEN TRINH MIGRATION!
echo ===================================================
pause