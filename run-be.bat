@echo off
echo INIT....

start "Gateway.YARP" cmd /k "cd Backend\Gateway.YARP && dotnet run"
start "Identity.API" cmd /k "cd Backend\Identity.API && dotnet run"
start "Movie.API" cmd /k "cd Backend\Movie.API && dotnet run"
start "Facility.API" cmd /k "cd Backend\Facility.API && dotnet run"
start "Cast.API" cmd /k "cd Backend\Cast.API && dotnet run"
start "Schedule.API" cmd /k "cd Backend\Schedule.API && dotnet run"
start "Booking.API" cmd /k "cd Backend\Booking.API && dotnet run"

echo OK